import { createCrudConfig, IpcCrudConfig } from "@main/ipc/utilities";
import { checkResources } from "./crud";

export const systemIpc = createCrudConfig({
  read: {
    checkResources,
  },
});

export type SystemIpc = typeof systemIpc;
export type SystemIpcAwaited = IpcCrudConfig<SystemIpc>;
