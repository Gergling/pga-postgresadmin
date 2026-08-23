import { getObjectKeys, wait } from "@/shared/utilities";
import {
  scheduleOperationFactory,
  TIMEOUT_PRESET_CONFIG,
  TimeoutPreset
} from "@/shared/features/system";
import { log, LogApi } from "@/main/shared";

// const logApi = log('Scheduler', async ({ log }) => ({
//   logAdd: log('Scheduling operations', async (logApi) => logApi),
//   logRun: log('Running operations', async (logApi) => logApi),
// }));

const {
  add,
  run: runScheduledOperations,
  schedules,
} = scheduleOperationFactory<{ logApi: LogApi; }>();

export const scheduleOperation = async (
  ...args: Parameters<typeof add>
) => {
  const timeout = args[0];
  const operation = args[1];
  return log(
    `Scheduling operation "${operation.name}" for ${timeout}`,
    async () => add(...args)
  );
}

log('Running scheduled operations', async ({ log }) => {
  const start = () => getObjectKeys(schedules).forEach(
    (timeout) => log(
      `Starting ${timeout} tick`, async (logApi) => {
        const tick = async (timeout: TimeoutPreset, { log, setStatus }: LogApi) => {
          const scheduled = schedules[timeout];
          const delay = TIMEOUT_PRESET_CONFIG[timeout];

          setStatus('information', `${timeout}: ${scheduled.length} operations`);

          await runScheduledOperations(timeout, { logApi });
          // await log(
          //   `${timeout}: ${scheduled.length} operations`,
          //   async (logApi) => {
          //     // if (response.status === 'no-operations') logApi.setStatus(
          //     //   'information', 'No operations scheduled.'
          //     // );
          //     return response;
          //   }
          // );

          await wait(delay);

          tick(timeout, logApi);
        };
        tick(timeout, logApi);
      }
    )
  );

  start();
});

scheduleOperation('10s', {
  name: 'Test operation',
  priority: async () => 1,
  run: async ({ logApi }) => logApi.log('Test operation log')
});

// Should be able to assign a schedule from outside the feature.
// Can probably host the assignment from @/shared. It just has to be run here.
// The interval can probably fall into a list of presets.
// The operation needs to have multiple components:
// A function simply returning a level of priority, which can be between 0 and 1
// (catch, error and skip loudly if anything violates).
// A function to run the operation.

// Ideally the scheduler will ultimately gather data on how long the operation
// ran for.
