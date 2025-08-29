import { DockerChecklistSubscriptionParams } from "../../shared/docker-postgres/types";
import { CHANNEL_SUBSCRIBE_TO_DOCKER_CHECKLIST } from "../../shared/channels";
import { subscribeToDockerChecklist } from "./commands";

export const setupDockerChecklistHandler = (
  ipcMain: Electron.IpcMain
) => {
  ipcMain.handle(CHANNEL_SUBSCRIBE_TO_DOCKER_CHECKLIST, (event, ...args) => {
    const subscription = (update: DockerChecklistSubscriptionParams) => {
      event.sender.send(CHANNEL_SUBSCRIBE_TO_DOCKER_CHECKLIST, update);
    }
    subscribeToDockerChecklist(subscription)
  });
}

export const setupDockerChecklistSubscription = (
  ipcRenderer: Electron.IpcRenderer,
  listener: (update: DockerChecklistSubscriptionParams) => void
) => {
  // TODO: Improve specialised IPC calls.
  const subscription = (
    event: Electron.IpcRendererEvent,
    ...args: DockerChecklistSubscriptionParams[]
  ) => {
    listener(args[0]);
  }
  ipcRenderer.on(CHANNEL_SUBSCRIBE_TO_DOCKER_CHECKLIST, subscription);
  ipcRenderer.invoke(CHANNEL_SUBSCRIBE_TO_DOCKER_CHECKLIST);

  return () => ipcRenderer.removeListener(CHANNEL_SUBSCRIBE_TO_DOCKER_CHECKLIST, subscription);
};
