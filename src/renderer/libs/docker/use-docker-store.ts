import { DockerStatus } from "../../../main/docker/types";
import { create } from "zustand";

type State = {
  checking: boolean;
  message: string;
  status: DockerStatus['status'] | 'unknown';
};
type Actions = {
  check: (checkDockerStatus: () => Promise<DockerStatus>) => void;
};

export const useDocker = create<State & Actions>((set) => ({
  checking: false,
  message: '',
  status: "unknown",
  check: (checkDockerStatus) => {
    set({ checking: true });
    checkDockerStatus().then(({ status }) => {
      console.log("Docker status:", status);
      set({ status });
    }).catch((error) => {
      console.error("Error checking Docker status:", error);
      set({ status: 'absent', message: error.message });
    }).finally(() => {
      set({ checking: false });
    });
  },
}));
