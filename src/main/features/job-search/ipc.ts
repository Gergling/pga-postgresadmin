import { createCrudConfig, IpcCrudConfig } from "../../ipc/utilities";
import { createApplication, createInteraction, fetchActiveApplications, fetchRecentInteractions, updateApplication, updateInteraction } from "./crud";

export const jobSearchIpc = createCrudConfig({
  create: {
    application: createApplication,
    interaction: createInteraction,
  },
  read: {
    activeApplications: fetchActiveApplications,
    recentInteractions: fetchRecentInteractions,
  },
  update: {
    application: updateApplication,
    interaction: updateInteraction,
  },
});

export type JobSearchIpc = typeof jobSearchIpc;
export type JobSearchIpcAwaited = IpcCrudConfig<JobSearchIpc>;
