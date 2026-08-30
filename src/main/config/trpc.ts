import { initTRPC } from '@trpc/server';
import { log, LogApi } from '../shared';

export const tRPC = initTRPC.create({ isServer: true, transformer: undefined });

type RpcLogProps = { input?: unknown; path: string; };
export const callRpcLog = <T extends RpcLogProps, U extends Promise<unknown>>(
  params: T, callback: (logApi: LogApi) => U
) => {
  const txt = `RPC(${params.path})`;
  if (typeof params.input === 'string') return log(
    `${txt}: ${params.input}`, (logApi) => callback(logApi)
  );
  return log(`${txt}`, (logApi) => callback(logApi));
}
export const rpcLog = <T extends RpcLogProps, U>(
  callback: (props: { params: T; logApi: LogApi; }) => Promise<U>,
) => {
  return (params: T): Promise<U> => {
    const txt = `RPC(${params.path})`;
    if (typeof params.input === 'string') return log(
      `${txt}: ${params.input}`, (logApi) => callback({ params, logApi })
    );
    return log(`${txt}`, (logApi) => callback({ params, logApi }));
  };
}
