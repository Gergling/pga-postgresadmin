import z from "zod";
import { observable } from '@trpc/server/observable';
import { createCrudConfig, IpcCrudConfig } from "@/main/ipc/utilities";
import { projectSchema } from "@/shared/features/projects";
import { tRPC } from "@/main/config";
import { GenerateCommitMessageUpdateProps } from "./types";
import {
  commitProjectStagedFiles,
  fetchProjectStagedCommitMessage
} from "./crud";
import { extractLocalProject, fetchProjectList } from "./extractors";
import { log } from "@/main/shared";

const projectsIpc = createCrudConfig({
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
  project: projectSchema,
});

export const projectsRouter = tRPC.router({
  commitStagedFiles: tRPC.procedure.input(inputSchema).mutation(({
    input: { message, project }
  }) => commitProjectStagedFiles(project, message)),
  fetchLocalStatus: tRPC.procedure.input(z.string()).query(
    ({ input }) => extractLocalProject(input)
  ),
  fetchList: tRPC.procedure.query(() => fetchProjectList()),
  fetchStagedCommitMessage: tRPC.procedure
    .input(projectSchema)
    .subscription(
      ({ input: project }) => observable<
        GenerateCommitMessageUpdateProps, GenerateCommitMessageUpdateProps
      >((emit) => {
        log(`RPC(fetchStagedCommitMessage: ${project.name})`, (
          logApi
        ) => fetchProjectStagedCommitMessage({ emit, logApi, project }));
      })
    ),
});
