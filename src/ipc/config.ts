import { IpcHandlerDatabase } from '../main/database/types';
import { IpcHandlerConfig, IpcInvocationConfigBase } from '../libs/ipc';
import { DatabaseItem, DatabaseResponseSelect } from '../renderer/shared/database/types';
import { DockerCommands, DockerStatus } from '../main/docker/types';

// Minimalist configuration type for the renderer side.
// IpcInvocationConfigBase really just makes these functions return promises.
export type IpcInvocationConfig = IpcInvocationConfigBase<{
  testIPC: (message: string) => string;

  createDatabase: (dbName: string) => { success: boolean; error?: string };
  selectDatabases: () => DatabaseResponseSelect<DatabaseItem>;

  checkDockerStatus: () => DockerStatus;
  checkDockerImage: () => DockerStatus;
}>;

export type IpcAdditionalParameters = {
  database: IpcHandlerDatabase;
  docker: DockerCommands;
};

// The handler configuration will run functions from the backend.
// This example includes a (custom) database handler object, which
// simply allows access to static functions.
export const ipcHandlerConfig: IpcHandlerConfig<
  IpcInvocationConfig,
  IpcAdditionalParameters
> = {
  testIPC: async ({ args: [message] }) => {
    console.log('IPC test received:', message);
    return `Received: ${message}`;
  },
  createDatabase: ({
    args: [dbName],
    database: { createDatabase },
  }) => createDatabase(dbName),
  selectDatabases: ({
    database: { selectDatabases }
  }) => selectDatabases(),

  checkDockerStatus: ({ docker: { runDockerInfo } }) => runDockerInfo(),
  checkDockerImage: ({ docker: { runDockerImageInspect } }) => runDockerImageInspect(),
};
