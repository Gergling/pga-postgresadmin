import { createCrudConfig, IpcCrudConfig } from "../../ipc/utilities";
import {
  createJobSearchInteraction,
  fetchActiveApplications,
  fetchApplication,
  fetchInteraction,
  updateApplication,
} from "./crud";

export const jobSearchIpc = createCrudConfig({
  create: {
    interaction: createJobSearchInteraction,
  },
  read: {
    activeApplications: fetchActiveApplications,
    application: fetchApplication,
    interaction: fetchInteraction,
    // recentInteractions: fetchRecentInteractions,
  },
  update: {
    application: updateApplication,
    // interaction: updateInteraction,
  },
});

export type JobSearchIpc = typeof jobSearchIpc;
export type JobSearchIpcAwaited = IpcCrudConfig<JobSearchIpc>;
