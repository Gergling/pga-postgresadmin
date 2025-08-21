export type DockerStatus = {
  error?: string;
  status: boolean;
  stderr?: string;
  stdout?: string;
};

export type DockerCommands = {
  runDockerInfo: () => Promise<DockerStatus>;
  runDockerImageInspect: () => Promise<DockerStatus>;
};
