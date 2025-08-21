import { UncertainBoolean } from "../../../shared/types";
import { DockerStatus } from "../../../main/docker/types";
import { create } from "zustand";

type DockerCommandCallback = () => Promise<DockerStatus>;

type StatusProp = 'running' | 'image';

type State = {
  checking: boolean;
  message: string;
} & {
  [K in StatusProp]: UncertainBoolean;
};
type Actions = {
  check: (
    checkDockerStatus: DockerCommandCallback,
    checkDockerImage: DockerCommandCallback,
  ) => void;
};

const runCheck = async (
  prop: StatusProp,
  check: DockerCommandCallback
): Promise<Partial<State>> => {
  try {
    const { error, stderr, stdout, status } = await check();
    return { [prop]: status ? 'yes' : 'no', message: (stderr || '') + error || stdout || '' };
  } catch (error) {
    return { [prop]: 'unknown', message: error.message }
  }
}

const runChecks = async (
  checks: { prop: StatusProp; check: DockerCommandCallback; }[],
  set: (partial: Partial<State>) => void,
): Promise<void> => {
  set({ checking: true });
  for (const { prop, check } of checks) {
    const state = await runCheck(prop, check);
    set(state);
    if (state[prop] !== 'yes') {
      return set({ checking: false });
    }
  }
};

export const useDocker = create<State & Actions>((set) => ({
  checking: false,
  message: '',
  running: "unknown",
  image: "unknown",
  check: async (checkDockerStatus, checkDockerImage) => {
    const checks: { prop: StatusProp; check: DockerCommandCallback; }[] = [
      { prop: 'running', check: checkDockerStatus },
      { prop: 'image', check: checkDockerImage },
    ];
    runChecks(checks, set);
  },
}));
