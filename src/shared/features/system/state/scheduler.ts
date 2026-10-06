import { StateManager, SubscriberParams } from "@/shared/utilities";
import { Queue } from "./types";
import { transformActivityForState } from "./activity";
import { transformQueueForState } from "./queue";
import { reduceSchedulerStateHistory } from "./history";

export const getSchedulerStateManager = () => StateManager.from({
  history: {} as Queue['history'],
  ...transformActivityForState([]),
  ...transformQueueForState([]),
}, {
  // Add to queue.
  queue: (
    state, name: string
  ) => {
    if (state.queue.includes(name)) return state;
    return {
      ...state,
      history: reduceSchedulerStateHistory(state.history, {
        name, now: Date.now(), status: 'queued'
      }),
      ...transformQueueForState([...state.queue, name])
    }
  },

  // Shift operation from the top of the queue and move it to active.
  // COuld specify the number of operations to kick off if there's spare
  // compute.
  start: (state, action: number) => {
    const operations = Array.from({ length: action }, () => state.queue.shift());
    const updatedState = operations.reduce(
      (acc, operation) => {
        if (!operation) return acc;
        const history = reduceSchedulerStateHistory(acc.history, {
          name: operation, now: Date.now(), status: 'active'
        });

        return {
          ...acc,
          history,
          ...transformActivityForState([...state.active, operation]),
        }
      },
      state
    );
    return {
      ...state, ...updatedState,
      ...transformQueueForState(state.queue),
    };
  },

  // Remove the operation from the active list. The problem here will be more to
  // do with uncaught activity completions which could clog the queue if
  // they're not removed on error. The queue won't be persisted though so the
  // buggery shouldn't be too severe.
  finish: (state, action: { name: string; status: 'success' | 'error' }) => {
    const active = state.active.filter((name) => name !== action.name);
    return {
      ...state,
      history: reduceSchedulerStateHistory(state.history, {
        name: action.name, now: Date.now(), status: action.status === 'success' ? 'completed' : 'failed'
      }),
      ...transformActivityForState(active),
    };
  },
});

export type SchedulerStateManager = ReturnType<typeof getSchedulerStateManager>;
type SchedulerStateManagerReducers = SchedulerStateManager['reducers'];
export type SchedulerStateManagerSubscriberParams<U extends keyof SchedulerStateManagerReducers = keyof SchedulerStateManagerReducers> = SubscriberParams<
  Queue, SchedulerStateManagerReducers, U
>;
