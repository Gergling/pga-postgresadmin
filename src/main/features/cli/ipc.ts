import { observable } from "@trpc/server/observable";
import z from "zod";
import { spawn } from 'node:child_process';
import { tRPC } from "@/main/config";
import { Temporal } from "@js-temporal/polyfill";

type SpawnResponse = 
  | { type: 'stdout'; data: string }
  | { type: 'stderr'; data: string }
  | { type: 'exit'; code: number | null };

// type Observer = {
//   complete: () => void;
//   error: (err: SpawnResponse) => void;
//   next: (value: SpawnResponse) => void;
// };

// const next = (observer: Observer, value: SpawnResponse) => {

//   observer.next(value);
// };

const t = () => `[${Temporal.Now.instant().toString()}]`;

export const cliRouter = tRPC.router({
  runCommand: tRPC.procedure
    .input(z.object({
      command: z.string(),
      args: z.array(z.string()).optional(),
    }))
    .subscription(
      ({ input }) => observable<
        SpawnResponse, SpawnResponse
      >((emit) => {
        const child = spawn(input.command, input.args);

        console.info(`${t()}: ${input.command} ${input.args?.join(' ')}`);

        child.stdout.on('data', (data) => {
          emit.next({ data: data.toString(), type: 'stdout' });
          console.info(`${t()} stdout: ${data.toString()}`);
        });
        child.stderr.on('data', (data) => {
          emit.next({ data: data.toString(), type: 'stderr' });
          console.error(`${t()} stderr: ${data.toString()}`);
        });
        child.on('error', (err) => {
          emit.next({ type: 'stderr', data: `Process Error: ${err.message}` });
          console.error(`${t()} error: ${err.toString()}`);
          emit.complete();
        });
        child.on('close', (code) => {
          emit.next({ code, type: 'exit' });
          console.info(`${t()} exiting with code: ${code}`);
          emit.complete();
        });

        return () => {
          if (child.pid && !child.killed) {
            child.kill();
          }
        };
      })
    ),
});
