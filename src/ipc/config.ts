import { IpcHandlerDatabase } from '../main/database/types';
import { IpcHandlerConfig, IpcInvocationConfigBase } from '../libs/ipc';

// Minimalist configuration type for the renderer side.
// IpcInvocationConfigBase really just makes these functions return promises.
export type IpcInvocationConfig = IpcInvocationConfigBase<{
  testIPC: (message: string) => string;
  runQuery: (query: string) => { success: boolean; error?: string };
}>;

// The handler configuration will run functions from the backend.
// This example includes a (custom) database handler object, which
// simply allows access to static functions.
export const ipcHandlerConfig: IpcHandlerConfig<
  IpcInvocationConfig,
  { database: IpcHandlerDatabase; }
> = {
  testIPC: async ({ args: [message] }) => {
    console.log('IPC test received:', message);
    return `Received: ${message}`;
  },
  runQuery: ({
    args: [query],
    database: { runQuery },
  }) => runQuery(query),
};
