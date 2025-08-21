export const DOCKER_PULL_POSTGRES_CHANNEL_DONE = 'docker-pull-postgres-done';
export const DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS = 'docker-pull-postgres-progress';

export type DockerPullPostgresChannel = 
  | typeof DOCKER_PULL_POSTGRES_CHANNEL_DONE
  | typeof DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS;
