import { initTRPC } from '@trpc/server';

export const tRPC = initTRPC.create({ isServer: true, transformer: undefined });
