// The interval can probably fall into a list of presets.
// The operation needs to have multiple components:
// A function simply returning a level of priority, which can be between 0 and 1
// (catch, error and skip loudly if anything violates).
// A function to run the operation.

import { getObjectKeys } from "@/shared/utilities";

// Logging SHOULD NOT be handled here. ONLY logic and the singleton data.

// Priority must be measured against system resources. This acts as a comparison.
// Some operations aren't worth running if certain system capacities aren't
// available (e.g. internet and syncing or non-local LLM). This acts as a filter.
// If an interval contains multiple operations

const createConfig = <
  T extends Record<string, unknown>
>(config: T): T => config;

export const TIMEOUT_PRESET_CONFIG = createConfig({
  '10s': 10000,
  '15s': 15000,
  '30s': 30000,
});

export type TimeoutPreset = keyof typeof TIMEOUT_PRESET_CONFIG;
type ScheduledOperation<Params = unknown> = {
  name: string;
  priority: (params: Params) => number | Promise<number>;
  run: (params: Params) => Promise<void>;
};
type RunReport = {
  status: 'no-operations' | 'success';
};
type EventCallback = (params: { type: '' }) => void;

type Schedules = Record<TimeoutPreset, ScheduledOperation[]>;

const schedules = getObjectKeys(TIMEOUT_PRESET_CONFIG).reduce(
  (acc, key) => ({ ...acc, [key]: [] }), {} as Schedules
);

// Example cases: Voting, email, explorer (incl. backfill).

// These can be run from anywhere in main (or renderer, technically...
// depending on whether we *should*... probably not since the renderer side has
// its own scheduling solutions in potentiae).
export const scheduleOperationFactory = <Params>(
  // cb: 
) => {
  const add = (
    timeout: TimeoutPreset, operation: ScheduledOperation<Params>
  ) => {
    schedules[timeout].push(operation);
    // cb(timeout, operation);
  };
  const run = async (timeout: TimeoutPreset, params: Params): Promise<RunReport> => {
    const operations = schedules[timeout];
    // TODO: 1. Filter by system capacities, e.g. internet, etc.
    // If no operations, quit with a 'no-operations' status,
    // ideally providing details of the missing requirements.

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
