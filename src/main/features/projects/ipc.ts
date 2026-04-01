import { createCrudConfig, IpcCrudConfig } from "@main/ipc/utilities";
import { commitProjectStagedFiles, fetchProjectList, fetchProjectStagedCommitMessage } from "./crud";

export const projectsIpc = createCrudConfig({
  create: {
    commit: commitProjectStagedFiles,
  },
  read: {
    commitMessage: fetchProjectStagedCommitMessage,
    list: fetchProjectList,
  },
});

export type ProjectsIpc = typeof projectsIpc;
export type ProjectsIpcAwaited = IpcCrudConfig<ProjectsIpc>;
