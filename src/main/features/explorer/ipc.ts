import z from 'zod';
import { tRPC } from '@/main/config';
import { findLockingProcesses, listContents } from './extractors';

export const explorerRouter = tRPC.router({
  list: tRPC.procedure.input(z.string()).query(
    ({ input }) => listContents(input),
  ),
  locks: tRPC.procedure.input(z.string()).query(
    ({ input }) => findLockingProcesses(input),
  ),
});
