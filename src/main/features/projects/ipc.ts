import z from "zod";
import { observable } from '@trpc/server/observable';
import { projectSchema } from "@/shared/features/projects";
import { callRpcLog, rpcLog, tRPC } from "@/main/config";
import { GenerateCommitMessageUpdateProps } from "./types";
import {
  commitProjectStagedFiles,
  fetchProjectStagedCommitMessage
} from "./crud";
import { fetchProjectList } from "./extractors";
import { projectUpdateLocalStatusByName, projectUpsertRoot } from "./etl";
import { readProjects } from "./db";

const inputSchema = z.object({
  message: z.string(),
  project: projectSchema,
});

export const projectsRouter = tRPC.router({
  commitStagedFiles: tRPC.procedure.input(inputSchema).mutation(({
    input: { message, project }
  }) => commitProjectStagedFiles(project, message)),
  // TODO: Setup readProject, and then retire this.
  // On startup, check the database. If there's a local project folder, and
  // local projects in there, don't bother with anything else.
  // If it's empty, extract.
  // Visiting the project queues an extraction.
  // UI is able to see that the extraction is queued. Somehow. Maybe there's a
  // queue id for a database or whatever.

  // Explorer can take care of the crud and data storage schema at the file
  // level. That includes code-related things.
  // Projects should handle individual project code data extraction such as
  // coverage, number of lines in the code file, etc.
  // Explorer should have a file-traversal function of some kind, but will need
  // to cache what stage the traversal got to, so disk space can be handled
  // natively to explorer, but code needs the schema to support values such as
  // undefined and false to express that the file isn't code or that it hasn't
  // been checked.
  fetchLocalStatus: tRPC.procedure.input(z.string()).query(
    rpcLog(
      ({ params: { input }, logApi }) => projectUpdateLocalStatusByName({
        name: input, logApi
      })
    )
  ),
  fetchList: tRPC.procedure.query(
    rpcLog(({ logApi }) => fetchProjectList(logApi))
  ),
  fetchStagedCommitMessage: tRPC.procedure
    .input(projectSchema)
    .subscription(
      ({ input: project, path }) => observable<
        GenerateCommitMessageUpdateProps, GenerateCommitMessageUpdateProps
      >((emit) => {
        callRpcLog({
          input: project, path
        }, (logApi) => fetchProjectStagedCommitMessage({
          emit, logApi, project
        }));
      })
    ),
  readList: tRPC.procedure.query(rpcLog(readProjects)),
  updateRoot: tRPC.procedure.mutation(rpcLog(
    ({ logApi }) => projectUpsertRoot(logApi)
  ))
});
