import { initTRPC } from '@trpc/server';
import { log, LogApi } from '../shared';

export const tRPC = initTRPC.create({ isServer: true, transformer: undefined });

export const rpcLog = <T>(
  { input, path }: {
    input?: string;
    path: string;
  }, callback: (logApi: LogApi) => Promise<T>
) => {
  const txt = `RPC(${path})`;
  if (input) return log(`${txt}: ${input}`, callback);
  return log(`${txt}`, callback);
}
