export type DockerStatus = {
  message?: string;
  status: 'running' | 'inactive' | 'absent';
};

export type DockerCommands = {
  runDockerInfo: () => Promise<DockerStatus>;
};
