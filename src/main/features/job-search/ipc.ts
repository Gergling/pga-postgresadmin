import { createCrudConfig, IpcCrudConfig } from "../../ipc/utilities";
import { createApplication, createInteraction, fetchActiveApplications, updateApplication } from "./crud";

export const jobSearchIpc = createCrudConfig({
  create: {
    application: createApplication,
    interaction: createInteraction,
  },
  read: {
    activeApplications: fetchActiveApplications,
    // fetching a list of interactions on its own doesn't seem that important yet
  },
  update: {
    application: updateApplication,
  },
});

export type JobSearchIpc = typeof jobSearchIpc;
export type JobSearchIpcAwaited = IpcCrudConfig<JobSearchIpc>;
