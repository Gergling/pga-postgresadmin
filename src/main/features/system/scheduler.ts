import { wait } from "@/shared/utilities";
import {
  getScheduleConfigurationReport,
  getSchedulerStateManager,
  ScheduledOperationParams,
  scheduleOperationFactory,
} from "@/shared/features/system";
import { log, LogApi } from "@/main/shared";

type LogParam = { logApi: LogApi; };

export const schedulerState = getSchedulerStateManager();

const {
  add,
  run: runScheduledOperations,
  schedules,
} = scheduleOperationFactory<LogParam>(schedulerState);

const state: {
  status: 'idle' | 'running';
} = {
  status: 'idle',
};

// TODO: The problem is as follows:
// We want to make the scheduled operation loop itself.
// Or do we?
// Somewhere we need to make a decision during runtime about whether an
// operation should be "queued".
// 1. We "shift" things off the queue. If the queue is empty, we pick suitable
// items from the operations. One at a time is fine for now. Later we can add
// items depending on how the computer resource is doing.
// 2. Run the operation. Keep a log of the time taken (ideally), but that isn't
// required immediately. Although a scheduled operation meta interface would be
// a good idea.
// 3. Operation completion sets the timeout scheduled appropriately for the
// operation.

// Make sure there is a "current" scheduled operation state. It will need to
// support multiple items. We would shift things off the queue and move them
// into another array for the status. They will be removed once the operation
// completes.

const initialiseScheduledOperations = ({ log }: LogApi) => log(
  `Initialising ${schedules.length} scheduled operations`,
  async (logApi) => {
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

              const report = await runScheduledOperations({
                logApi: {
                  ...logApi, options: {
                    ...logApi.options, showSummary: false
                  }
                }
              });

              if (report.status === 'multi') return setStatus(
                'information', 'Schedule not repeating due to multiple schedules'
              );
              if (report.status === 'no-operations') setStatus(
                'information', 'No operations found for schedule'
              );

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

    await start();
  }
);

export const scheduleOperation = async (
  params: ScheduledOperationParams<LogParam>
) => log(
  `Scheduling operation "${params.name}"`, async (logApi) => {
    const addResponse = add(params);
    if (state.status === 'idle') await initialiseScheduledOperations(logApi);
    return addResponse;
  }
);
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
