import z from "zod";
import { observable } from '@trpc/server/observable';
import { projectSchema } from "@/shared/features/projects";
import { rpcLog, tRPC } from "@/main/config";
import { GenerateCommitMessageUpdateProps } from "./types";
import {
  commitProjectStagedFiles,
  fetchProjectStagedCommitMessage
} from "./crud";
import { extractLocalProject, fetchProjectList } from "./extractors";

const inputSchema = z.object({
  message: z.string(),
  project: projectSchema,
});

export const projectsRouter = tRPC.router({
  commitStagedFiles: tRPC.procedure.input(inputSchema).mutation(({
    input: { message, project }
  }) => commitProjectStagedFiles(project, message)),
  fetchLocalStatus: tRPC.procedure.input(z.string()).query(
    ({ input, path }) => rpcLog(
      { input, path }, (logApi) => extractLocalProject({ name: input, logApi })
    )
  ),
  fetchList: tRPC.procedure.query(({ path }) => rpcLog({ path }, fetchProjectList)),
  fetchStagedCommitMessage: tRPC.procedure
    .input(projectSchema)
    .subscription(
      ({ input: project, path }) => observable<
        GenerateCommitMessageUpdateProps, GenerateCommitMessageUpdateProps
      >((emit) => {
        rpcLog({ input: project.name, path }, (
          logApi
        ) => fetchProjectStagedCommitMessage({ emit, logApi, project }));
      })
    ),
});
