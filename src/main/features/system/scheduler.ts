import { wait } from "@/shared/utilities";
import {
  getScheduleConfigurationReport,
  scheduleOperationFactory,
} from "@/shared/features/system";
import { log, LogApi } from "@/main/shared";

const {
  add,
  run: runScheduledOperations,
  schedules,
} = scheduleOperationFactory<{ logApi: LogApi; }>();

export const scheduleOperation = async (
  ...args: Parameters<typeof add>
) => {
  const operation = args[0];
  return log(
    `Scheduling operation "${operation.name}"`,
    async () => add(...args)
  );
}

log('Running scheduled operations', async (logApi) => {
  const start = () => Promise.all(schedules.map(
    (operation) => {
      // Just leaving this here as a reminder that we may want to delay a
      // scheduled operation later for any reason.
      // const { onStart } = operation.event();

      const {
        description,
      } = getScheduleConfigurationReport(operation.event());

      return logApi.log(
        `Running ${operation.name}: ${description.initialisation}`, async (logApi) => {
          const tick = async ({ log, setStatus }: LogApi) => {
            const scheduleConfiguration = operation.event();
            const {
              config: { delay },
            } = getScheduleConfigurationReport(scheduleConfiguration);
            const { repeat } = scheduleConfiguration;

            await runScheduledOperations({
              logApi: {
                ...logApi, options: {
                  ...logApi.options, showSummary: false
                }
              }
            });

            if (repeat) {
              await wait(delay);

              tick(logApi);
            }
          };
          tick(logApi);
        }
      )
    }
  ));

  start();
});

scheduleOperation({
  event: { repeat: false },
  name: 'Non-repeating test operation',
  priority: async () => 1,
  run: async ({ logApi }) => logApi.log('Non-repeating test operation log title')
});
scheduleOperation({
  event: { repeat: true },
  name: 'Repeating test operation',
  priority: async () => 1,
  run: async ({ logApi }) => logApi.log(
    'Repeating test operation log title',
    async (logApi) => {
      console.log('Repeating test operation log content');
    }, { showSummary: true }
  )
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
