import z from 'zod';
import { observable } from '@trpc/server/observable';
import { tRPC } from '@/main/config';
import { findLockingProcesses, listContents } from './extractors';
import { emitUnitTest, GenerateUnitTestUpdateProps } from './transformers';

export const explorerRouter = tRPC.router({
  list: tRPC.procedure.input(z.string()).query(
    ({ input }) => listContents(input),
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
