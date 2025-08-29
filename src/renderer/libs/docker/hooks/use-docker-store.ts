// TODO: There's a lot in this file we can just junk.
import { UncertainBoolean } from "../../../../shared/types";
import { create } from "zustand";
import { getIpc } from "../../../shared/ipc/util";
import { DockerChecklistStatusViewItem, DockerContainerStates, DockerStatus } from "../../../../shared/docker-postgres/types";

type DockerCommandCallback = () => Promise<DockerStatus>;

export type DockerPostgresPhase = 'engine' | 'image' | 'exists' | 'running';

type State = {
  message: string;
  imageLayers: string[];
  phase: {
    breakdown: {
      [K in DockerPostgresPhase]: UncertainBoolean;
    };
    current: DockerPostgresPhase;
  };
  container: DockerContainerStates | 'unknown' | 'recheck';
  checklist: DockerChecklistStatusViewItem[];

  // TODO: Junk these.
  actionCallbacks: Omit<{
    [K in DockerPostgresPhase]: () => void;
  }, 'engine'> | undefined;
  statusCallbacks: {
    [K in DockerPostgresPhase]: DockerCommandCallback;
  } | undefined;
};
type Actions = {
  // initialise: (actions: Required<State>['actionCallbacks'], status: Required<State>['statusCallbacks']) => void;
  isInitialised: () => boolean;
  reset: () => void;
  runChecklist: () => void;
  updatePhase: () => void;
  updatePullProgress: (layer: string) => void;
  updatePullStatus: (status: UncertainBoolean, message: string) => void;
};


const initialPhase: State['phase'] = {
  breakdown: {
    engine: "unknown",
    exists: 'unknown',
    image: "unknown",
    running: "unknown",
  },
  current: 'engine',
};

export const useDockerStore = create<State & Actions>((set, get) => {
  const { subscribeToDockerChecklist } = getIpc();

  console.log('Subscribing to docker checklist');
  const removeListener = subscribeToDockerChecklist(({
    checklist
  }) => {
    console.log('Checklist update:', checklist);
    set({ checklist });
  });
  // TODO: Run removeListener when the checklist has completed.

  return {
    checklist: [],

    message: '',
    phase: initialPhase,
    imageLayers: [],
    container: 'unknown',

    actionCallbacks: undefined,
    statusCallbacks: undefined,
    isInitialised: () => {
      const { actionCallbacks, statusCallbacks } = get();
      if (actionCallbacks && statusCallbacks) return true;
      return false;
    },
    reset: () => {
      set({ container: 'unknown', imageLayers: [], phase: initialPhase });
    },

    // Pull progress has a potentially long asynchronous process to it, so we
    // need special update functions.
    updatePullProgress: (layer) => {
      // const { phase, imageLayers } = get();
      // set({
      //   phase: {
      //     ...phase,
      //     breakdown: {
      //       ...phase.breakdown,
      //       image: 'unknown'
      //     },
      //   },
      //   imageLayers: [...imageLayers, layer],
      // });
    },
    updatePullStatus: (status, message) => {
      // const { phase } = get();
      // set({
      //   phase: {
      //     ...phase,
      //     breakdown: {
      //       ...phase.breakdown, 
      //       image: status,
      //     },
      //   },
      //   message,
      // });

      // if (status === 'yes') {
      //   set({ imageLayers: [] });
      // }
    },
    updatePhase: () => {
      // const { phase, runChecklist } = get();
      // const { next } = phase;
      // if (next) {
      //   set({ phase: { ...phase, current: next, next: undefined } });
      //   runChecklist();
      // }
    },
    runChecklist: async () => {
      // const { phase, updatePhase, runChecklist } = get();
      // console.log('Running checklist', phase);

      // // if (!actionCallbacks || !statusCallbacks) throw new Error(`No action callbacks or status callbacks set. Need to run "initialise" before other functions.`);

      // // const { container, engine } = statusCallbacks;
      // const { current: currentPhase } = phase;
      // const {
      //   checkDockerContainer,
      //   checkDockerImage,
      //   checkDockerStatus,
      //   pullPostgresImage,
      //   runDockerContainer,
      //   startDockerContainer,
      // } = getIpc();
      // const decisions: Decisions = {
      //   engine: {
      //     check: checkDockerStatus,
      //     next: () => 'image',
      //     failure: () => {
      //       // Start up the engine, probably using docker desktop start or something.
      //       // This may require another asynchronous process set from outside the store.
      //       console.log('running failure')
      //     },
      //   },
      //   image: {
      //     // Image doesn't need an image check command to call because the pull
      //     // command updates the state through updatePullStatus.
      //     check: checkDockerImage,
      //     next: () => 'exists',
      //     failure: () => {
      //       // Start the image pull.
      //       console.log('image check failed, pulling')
      //       // TODO: Need to distinguish clearly between the image not existing and other errors... should other errors
      //       // occur.
      //       pullPostgresImage();
      //     },
      //   },
      //   exists: {
      //     check: async () => {
      //       const { status, ...result } = await checkDockerContainer();

      //       set({ container: status });

      //       if (status === 'missing') return { ...result, status: false };

      //       return { ...result, status: true };
      //     },
      //     next: () => 'running',
      //     failure: () => {
      //       console.log('container not running')
      //       // actionCallbacks.container();
      //       runDockerContainer();
      //     }
      //   },
      //   running: {
      //     check: async () => {
      //       const { container } = get();

      //       if (container === 'recheck') {
      //         const { status } = await checkDockerContainer();
      //         return { status: status === 'running' };
      //       }

      //       set({ container: 'recheck' });

      //       return { status: container === 'running' };
      //     },
      //     next: () => undefined,
      //     failure: startDockerContainer,
      //     // failure: () => {
      //     //   set({ phase: { ...phase, breakdown: { ...phase.breakdown, running: 'unknown' } }});
      //     //   setTimeout(() => {
      //     //     startDockerContainer();
      //     //     // TODO: Could implement a backoff strategy here to avoid infinite loops.
      //     //     // Could also implement a max retry count.
      //     //   }, 1000);
      //     // },
      //   },
      // };

      // const { message, nextPhase, status } = await runDecision(decisions[currentPhase]);

      // // if (next) {
      // //   set({ phase: { ...phase, current: next, next: undefined } });
      // //   runChecklist();
      // // }
      // console.log('Decision result:', currentPhase, { message, nextPhase, status });

      // const updatedPhase: State['phase'] = {
      //   ...phase,
      //   breakdown: {
      //     ...phase.breakdown,
      //     [currentPhase]: status,
      //   },
      // };

      // // set({
      // //   message,
      // //   phase: {
      // //     ...phase,
      // //     breakdown: {
      // //       ...phase.breakdown,
      // //       [currentPhase]: status,
      // //     },
      // //   }
      // // });
      // if (nextPhase) {
      //   updatedPhase.current = nextPhase;
      //   // runChecklist();
      // } else {
      //   // const previousStatus = phase.breakdown[currentPhase];
      //   // if (previousStatus !== 'yes' && status !== 'yes') {
      //   //   setTimeout(() => {
      //   //     runChecklist();
      //   //     // TODO: Could implement a backoff strategy here to avoid infinite loops.
      //   //     // Could also implement a max retry count.
      //   //   }, 5000);
      //   // }
      // }

      // // const previousStatus = phase.breakdown[currentPhase]
      // set({
      //   message,
      //   phase: updatedPhase,
      // });

      // if (nextPhase) {
      //   // TODO: COuld reset timeout.
      //   // runChecklist();
      // }

      // // TODO: Why is the recheck happening twice?
      // // TODO: Why does it cause an infinite loop without the setTimeout?
      // // if (previousStatus !== 'yes' && status !== 'yes') {
      // if (nextPhase || status !== 'yes') {
      //   setTimeout(() => {
      //     // runChecklist();
      //     // TODO: Could implement a backoff strategy here to avoid infinite loops.
      //     // Could also implement a max retry count.
      //   }, 1000);
      // }

      // updatePhase();
    },
  }
});
