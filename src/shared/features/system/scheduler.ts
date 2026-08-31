// The interval can probably fall into a list of presets.
// The operation needs to have multiple components:
// A function simply returning a level of priority, which can be between 0 and 1
// (catch, error and skip loudly if anything violates).
// A function to run the operation.

// Logging SHOULD NOT be handled here. ONLY logic and the singleton data.

// Priority must be measured against system resources. This acts as a comparison.
// Some operations aren't worth running if certain system capacities aren't
// available (e.g. internet and syncing or non-local LLM). This acts as a filter.
// If an interval contains multiple operations

const createConfig = <
  T extends Record<string, unknown>
>(config: T): T => config;

// We currently have two cases:
// Repeats
// One-time on startup

// Will also want inactivity-tapering for checks that are more likely to orient
// around user-action.

// We already have a "priority" function which can be used to rank functions
// and compare to available resources.

export const TIMEOUT_PRESET_CONFIG = createConfig({
  '10s': 10000,
  '15s': 15000,
  '30s': 30000,
});

type ScheduleConfiguration = {
  repeat: boolean;
};

type ScheduleEventConfiguration = () => ScheduleConfiguration;


export const getScheduleConfigurationReport = (
  configuration: ScheduleConfiguration
) => {
  const delay = 10000;
  const initialisation = configuration.repeat
    ? 'to be repeated'
    : 'once on startup';
  const config = { delay };
  const description = { initialisation };

  return { config, description };
};

type ScheduledOperationBase<Params = unknown> = {
  name: string;
  priority: (params: Params) => number | Promise<number>;
  run: (params: Params) => Promise<void>;
};
type ScheduledOperationParams<
  Params = unknown
> = ScheduledOperationBase<Params> & {
  event: ScheduleConfiguration | ScheduleEventConfiguration;
};
type ScheduledOperation<
  Params = unknown
> = ScheduledOperationBase<Params> & {
  event: ScheduleEventConfiguration;
};
type RunReport = {
  status: 'no-operations' | 'success';
};

const schedules: ScheduledOperation[] = [];


// Example cases: Voting, email, explorer (incl. backfill).

// These can be run from anywhere in main (or renderer, technically...
// depending on whether we *should*... probably not since the renderer side has
// its own scheduling solutions in potentiae).
export const scheduleOperationFactory = <Params>() => {
  const add = (
    { event, ...params }: ScheduledOperationParams<Params>
  ) => {
    if (typeof event !== 'function') {
      return schedules.push({ ...params, event: () => event });
    }
    return schedules.push({ ...params, event });
  };
  const run = async (params: Params): Promise<RunReport> => {
    const operations = schedules;
    // TODO: 1. Filter by system capacities, e.g. internet, etc.
    // If no operations, quit with a 'no-operations' status,
    // ideally providing details of the missing requirements.
    // This is a placeholder, which is why it does nothing.
    const availableOperations = operations.filter((_) => true);

    if (availableOperations.length === 0) return { status: 'no-operations' };

    const priorities = await Promise.all(
      operations.map(({ priority }) => priority(params))
    );

    // const availableOperations = operations.filter(
    //   (_, index) => priorities[index] > 0.3
    // );

    // 2. Compare priority with system resource available (loop them).
    // Check CPU comparison: failure is immediate in red band.
    // Check Memory comparison: failure is immediate in red band.

    // 3. IF there are still multiple operations remaining:
    // Red compute: run highest priority operation.
    // Otherwise, run everything.
    // If no operations, return that nothing got through the priority because
    // the compute availability was too low.

    // if (!availableOperations.length) return 'no-operations';
    // if (availableOperations.length > 0) {
    //   const [{ run: operation }] = availableOperations;
    //   await operation(logApi);
    //   return;
    // }

    // TODO: Ultimately, we can record:
    // Operation History Collection:
    //   - The operation name
    //   - The serialised schedule time it started.
    //   - The serialised schedule time it ended.
    //   - The CPU amount and band at completion.
    //   - The memory amount and band at completion.
    // Schedule History Collection:
    //   - The SAME serialised schedule time as the started operations.
    //   - The number of operations completed.
    //   - The starting cpu amount and band.
    //   - The starting memory amount and band.
    // This will allow us to later calculate operation "weights" in order to
    // resolve priority ties.

    return { status: 'success' };
  };
  return { add, run, schedules };
};
