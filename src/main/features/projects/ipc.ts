import z from "zod";
import { createCrudConfig, IpcCrudConfig } from "@/main/ipc/utilities";
import { PROJECT_SCHEMA } from "@/shared/features/projects/config";
import { tRPC } from "@/main/config";
import {
  commitProjectStagedFiles,
  fetchProjectList,
  fetchProjectStagedCommitMessage
} from "./crud";

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

const inputSchema = z.object({
  message: z.string(),
  project: PROJECT_SCHEMA,
});

export const projectsRouter = tRPC.router({
  commitProjectStagedFiles: tRPC.procedure.input(inputSchema).query(({
    input: { message, project }
  }) => commitProjectStagedFiles(project, message)),
  fetchProjectStagedCommitMessage: tRPC.procedure.input(PROJECT_SCHEMA).query(({
    input: project
  }) => fetchProjectStagedCommitMessage(project)),
  fetchProjectList: tRPC.procedure.query(() => fetchProjectList()),
});

