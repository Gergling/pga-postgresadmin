import z from 'zod';
import { observable } from '@trpc/server/observable';
import { log } from '@/main/shared';
import { tRPC } from '@/main/config';
import {
  findLockingProcesses,
  listContents,
  readFileNode
} from './extractors';
import { emitUnitTest, GenerateUnitTestUpdateProps } from './transformers';

export const explorerRouter = tRPC.router({
  list: tRPC.procedure.input(z.string()).query(
    ({ input }) => log(`RPC(list: ${input})`, (logApi) => listContents(input, logApi)),
  ),
  node: tRPC.procedure.input(z.string()).query(
    ({ input }) => log(`RPC(node: ${input})`, (logApi) => readFileNode(input, logApi)),
  ),
  locks: tRPC.procedure.input(z.string()).query(
    ({ input }) => findLockingProcesses(input),
  ),
  createUnitTest: tRPC.procedure
    .input(z.string())
    .subscription(
      ({ input: sourceFilePath }) => observable<
        GenerateUnitTestUpdateProps, GenerateUnitTestUpdateProps
      >((emit) => {
        emitUnitTest({ emit, sourceFilePath });
      })
    ),
});
