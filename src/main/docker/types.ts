import { DatabaseServerCredentials, DockerChecklistSubscriptionParams, DockerStatus } from "../../shared/docker-postgres/types";
import { GeneralResponse } from "../../shared/types";

type AsyncCommand<T = DockerStatus> = () => Promise<T>;

export type DockerCommands = {
  loadDatabaseServerCredentials: AsyncCommand<DatabaseServerCredentials | undefined>,
  saveDatabaseServerCredentials: (credentials: DatabaseServerCredentials) => Promise<GeneralResponse>,
  subscribeToDockerChecklist: (
    subscription: (
      update: DockerChecklistSubscriptionParams
    ) => void
  ) => void;
};
