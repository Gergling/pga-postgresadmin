import z from 'zod';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import { tRPC } from '@/main/config';
import { settingsRouter } from '@/main/features/settings';

const ee = new EventEmitter();

export const router = tRPC.router({
  settings: settingsRouter,
  greeting: tRPC.procedure.input(z.object({ name: z.string() })).query((req) => {
    const { input } = req;

    ee.emit('greeting', `Greeted ${input.name}`);
    return {
      text: `Hello ${input.name}` as const,
    };
  }),
  subscription: tRPC.procedure.subscription(() => {
    return observable((emit) => {
      function onGreet(text: string) {
        emit.next({ text });
      }

      ee.on('greeting', onGreet);

      return () => {
        ee.off('greeting', onGreet);
      };
    });
  }),
});

export type AppRouter = typeof router;
