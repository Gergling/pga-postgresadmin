import { UncertainBoolean } from "../../../shared/types";
import { DockerStatus } from "../../../main/docker/types";
import { create } from "zustand";

type DockerCommandCallback = () => Promise<DockerStatus>;

type StatusProp = 'engine' | 'container';
type Phase = StatusProp | 'image';

type Decision = {
  check: DockerCommandCallback;
  next: () => Phase | undefined;
  failure?: () => void;
};

type State = {
  checking: boolean;
  message: string;
  imageLayers: string[];
  phase: {
    breakdown: {
      [K in Phase]: UncertainBoolean;
    };
    current: Phase;
    next: Phase | undefined;
  };
  actionCallbacks: {
    image: () => void;
  } | undefined;
  statusCallbacks: {
    [K in Phase]: DockerCommandCallback;
  } | undefined;
};
type Actions = {
  initialise: (actions: Required<State>['actionCallbacks'], status: Required<State>['statusCallbacks']) => void;
  isInitialised: () => boolean;
  reset: () => void;
  runChecklist: () => void;
  updatePhase: () => void;
  updatePullProgress: (layer: string) => void;
  updatePullStatus: (status: UncertainBoolean, message: string) => void;
};

type Decisions = {
  [K in Phase]: Decision;
};

const runDecision = async ({
  check,
  next,
  failure,
}: Decision): Promise<{
  message: string;
  nextPhase?: Phase;
  status?: UncertainBoolean;
}> => {
  try {
    const { error, stderr, stdout, status } = await check();
    const message = (stderr || '') + error || stdout || '';
    if (status) {
      const nextPhase = next();
      if (nextPhase) {
        return {
          message,
          nextPhase,
          status: 'yes',
        };
      }
    }
    if (!status && failure) failure();

    return {
      message,
      status: 'no',
    };
  } catch (error) {
    return {
      message: error,
      status: 'no',
    };
  }
};

const initialPhase: State['phase'] = {
  breakdown: {
    container: 'unknown',
    engine: "unknown",
    image: "unknown",
  },
  current: 'engine',
  next: undefined,
};

export const useDockerStore = create<State & Actions>((set, get) => ({
  checking: false,
  message: '',
  phase: initialPhase,
  imageLayers: [],

  actionCallbacks: undefined,
  statusCallbacks: undefined,
  isInitialised: () => {
    const { actionCallbacks, statusCallbacks } = get();
    if (actionCallbacks && statusCallbacks) return true;
    return false;
  },
  initialise: (actionCallbacks, statusCallbacks) => {
    set({ actionCallbacks, statusCallbacks });
  },
  reset: () => {
    set({ phase: initialPhase });
  },

  // Pull progress has a potentially long asynchronous process to it, so we
  // need special update functions.
  updatePullProgress: (layer) => {
    const { phase, imageLayers } = get();
    set({
      phase: {
        ...phase,
        breakdown: {
          ...phase.breakdown,
          image: 'unknown'
        },
      },
      imageLayers: [...imageLayers, layer],
    });
  },
  updatePullStatus: (status, message) => {
    const { phase } = get();
    set({
      phase: {
        ...phase,
        breakdown: {
          ...phase.breakdown, 
          image: status,
        },
      },
      message,
    });

    if (status === 'yes') {
      set({ imageLayers: [] });
    }
  },
  updatePhase: () => {
    const { phase, runChecklist } = get();
    const { next } = phase;
    if (next) {
      set({ phase: { ...phase, current: next, next: undefined } });
      runChecklist();
    }
  },
  runChecklist: async () => {
    const { actionCallbacks, phase, statusCallbacks, updatePhase } = get();

    if (!actionCallbacks || !statusCallbacks) throw new Error(`No action callbacks or status callbacks set. Need to run "initialise" before other functions.`);

    const { image } = actionCallbacks;
    const { container, engine } = statusCallbacks;
    const { current: currentPhase } = phase;
    const decisions: Decisions = {
      engine: {
        check: engine,
        next: () => 'image',
        failure: () => {
          // Start up the engine, probably using docker desktop start or something.
          // This may require another asynchronous process set from outside the store.
          console.log('running failure')
        },
      },
      image: {
        // Image doesn't need an image check command to call because the pull
        // command updates the state through updatePullStatus.
        check: statusCallbacks.image,
        next: () => 'container',
        failure: () => {
          // Start the image pull.
          console.log('image check failed, pulling')
          // TODO: Need to distinguish clearly between the image not existing and other errors... should other errors
          // occur.
          image();
        },
      },
      container: {
        check: container,
        next: () => {
          console.log('we are done here')
          return undefined;
        },
        failure: () => {
          console.log('container not running')
        }
      },
    };

    const { message, nextPhase, status } = await runDecision(decisions[currentPhase]);

    set({
      message,
      phase: {
        ...phase,
        breakdown: {
          ...phase.breakdown,
          [currentPhase]: status,
        },
        next: nextPhase,
      }
    });

    updatePhase();
  },
}));
