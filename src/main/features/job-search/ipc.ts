import { createCrudConfig, IpcCrudConfig } from "../../ipc/utilities";
import {
  createApplication,
  createInteraction,
  fetchActiveApplications,
  fetchApplication,
  fetchRecentInteractions,
  updateApplication,
  updateInteraction
} from "./crud";

export const jobSearchIpc = createCrudConfig({
  create: {
    application: createApplication,
    interaction: createInteraction,
  },
  read: {
    activeApplications: fetchActiveApplications,
    application: fetchApplication,
    recentInteractions: fetchRecentInteractions,
  },
  update: {
    application: updateApplication,
    interaction: updateInteraction,
  },
});

export type JobSearchIpc = typeof jobSearchIpc;
export type JobSearchIpcAwaited = IpcCrudConfig<JobSearchIpc>;
