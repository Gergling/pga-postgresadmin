import { CommandStatusResponse } from "../../shared/types";

export type DockerStatus<T = boolean> = CommandStatusResponse<T>;

export type DockerCommands = {
  runDockerInfo: () => Promise<DockerStatus>;
  runDockerImageInspect: () => Promise<DockerStatus>;
  runDockerPSPostgres: () => Promise<DockerStatus>;
  runDockerPullPostgres: (event: Electron.IpcMainInvokeEvent) => void;
};
