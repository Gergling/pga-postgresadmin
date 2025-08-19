export type DockerStatus = {
  error?: string;
  status: 'running' | 'inactive';
  stderr?: string;
  stdout?: string;
};

export type DockerCommands = {
  runDockerInfo: () => Promise<DockerStatus>;
};
