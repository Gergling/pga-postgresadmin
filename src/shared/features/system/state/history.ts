import { Reducer } from "react";
import { codec } from "@/shared/utilities";
import { HistoryItem, PhaseQueued, Queue } from "./types";

const initialHistoryItem: HistoryItem = {
  completed: [],
  current: [],
  failed: 0,
};

export type DecodedSchedulerTiming = {
  queued?: number; activated?: number; completed?: number; duration?: number;
};
export const schedulerTimingCodec = codec({
  decode: ([queued, activated, completed, duration]: number[]) => ({
    queued, activated, completed, duration
  }),
  encode: (
    { queued, activated, completed, duration }: DecodedSchedulerTiming
  ): number[] => [queued, activated, completed, duration].filter(
    (t): t is number => t !== undefined
  ),
});

const reduceSchedulerStateHistoryItem: Reducer<
  Queue['history'][string], { now: number; status: PhaseQueued; }
> = (state, { now, status }) => {
  if (status === 'failed') return {
    ...state,
    current: [],
    failed: state.failed + 1,
  };
  const { queued, activated } = schedulerTimingCodec.decode(state.current);
  if (!queued) {
    if (status === 'queued') return {
      ...state, current: schedulerTimingCodec.encode({ queued: now })
    };
    return state;
  }
  if (!activated) {
    if (status === 'active') return {
      ...state, current: schedulerTimingCodec.encode({ queued, activated: now })
    };
    return state;
  }
  return {
    ...state,
    completed: schedulerTimingCodec.encode({
      queued, activated, completed: now, duration: now - activated
    }), current: []
  };
};
export const reduceSchedulerStateHistory: Reducer<
  Queue['history'], { name: string; now: number; status: PhaseQueued; }
> = (state, { name, ...action }) => ({
  ...state, [name]: reduceSchedulerStateHistoryItem(
    state[name] ?? initialHistoryItem, action
  )
});
