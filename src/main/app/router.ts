import z from 'zod';
import { EventEmitter } from 'events';
import { tRPC } from '@/main/config';
import { projectsRouter } from '@/main/features/projects';
import { settingsRouter } from '@/main/features/settings';
import { systemRouter } from '@/main/features/system';

const ee = new EventEmitter();

export const router = tRPC.router({
  projects: projectsRouter,
  settings: settingsRouter,
  system: systemRouter,

  greeting: tRPC.procedure.input(z.object({ name: z.string() })).query((req) => {
    const { input } = req;

    ee.emit('greeting', `Greeted ${input.name}`);
    return {
      text: `Hello ${input.name}` as const,
    };
  }),
});
