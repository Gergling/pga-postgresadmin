import z from "zod";
import { observable } from '@trpc/server/observable';
import { createCrudConfig, IpcCrudConfig } from "@/main/ipc/utilities";
import { PROJECT_SCHEMA } from "@/shared/features/projects/config";
import { tRPC } from "@/main/config";
import {
  commitProjectStagedFiles,
  fetchProjectList,
  fetchProjectStagedCommitMessage
} from "./crud";
import { GenerateCommitMessageUpdateProps } from "./types";

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
  commitStagedFiles: tRPC.procedure.input(inputSchema).mutation(({
    input: { message, project }
  }) => commitProjectStagedFiles(project, message)),
  fetchStagedCommitMessage: tRPC.procedure
    .input(PROJECT_SCHEMA)
    .subscription(
      ({ input: project }) => observable<
        GenerateCommitMessageUpdateProps, GenerateCommitMessageUpdateProps
      >((emit) => {
        fetchProjectStagedCommitMessage({ emit, project })
      })
    ),
  fetchList: tRPC.procedure.query(() => fetchProjectList()),
});

