import { CommandResponse, CommandStatusResponse, UncertainBoolean } from "../types";

export const DOCKER_PULL_POSTGRES_CHANNEL_DONE = 'docker-pull-postgres-done';
export const DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS = 'docker-pull-postgres-progress';

export type DockerPullPostgresChannel = 
  | typeof DOCKER_PULL_POSTGRES_CHANNEL_DONE
  | typeof DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS;

export type DockerStatus<T = boolean> = CommandStatusResponse<T>;

export type DockerContainerStatus = DockerStatus<DockerContainerStates>;

export type DatabaseServerCredentials = {
  user: string;
  host: string;
  port: number;
  database: string;
  password?: string; // Optional, as it may not be provided every time
};

export type DockerContainerStates = 'missing' | 'stopped' | 'running';
export type DockerEngineStates = 'not-installed' | 'installed' | 'paused' | 'running';
export type DockerImageStates = 'pulling' | 'exists' | 'error';

export type DockerChecklistName = 'engine' | 'image' | 'container-exists' | 'container-running';

export type DockerChecklistPhaseStatusBase = 'checking' | 'unknown';
export type DockerChecklistContainerStatus = DockerChecklistPhaseStatusBase | DockerContainerStates;
export type DockerChecklistEngineStatus = DockerChecklistPhaseStatusBase | DockerEngineStates;
export type DockerChecklistImageStatus = DockerChecklistPhaseStatusBase | DockerImageStates;
export type DockerChecklistPhaseStates = {
  phase: 'container';
  status: DockerChecklistContainerStatus;
} | {
  phase: 'engine';
  status: DockerChecklistEngineStatus;
} | {
  phase: 'image';
  status: DockerChecklistImageStatus;
};

export type DockerChecklistStatusViewItem = {
  description?: string;
  name: DockerChecklistName;
  status: UncertainBoolean;
};

export type DockerChecklistSubscriptionParams = {
  checklist: DockerChecklistStatusViewItem[];
  isCompleted: boolean;
} & DockerChecklistPhaseStates & CommandResponse;
