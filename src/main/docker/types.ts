// TODO: Everything except status is a more generic command line response type.
export type DockerStatus<T = boolean> = {
  error?: string;
  status: T;
  stderr?: string;
  stdout?: string;
};

export type DockerCommands = {
  runDockerInfo: () => Promise<DockerStatus>;
  runDockerImageInspect: () => Promise<DockerStatus>;
  runDockerPullPostgres: (event: Electron.IpcMainInvokeEvent) => void;
};
