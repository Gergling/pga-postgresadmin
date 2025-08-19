export type DockerStatus = { status: string };

export type DockerCommands = {
  runDockerInfo: () => Promise<DockerStatus>;
};
