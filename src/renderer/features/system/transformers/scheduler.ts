import { getObjectEntries } from "@/shared/utilities";
import {
  getRelativeTimeStringNow,
  getTemporalZonedDateTime
} from "@/shared/lib/temporal";
import {
  DecodedSchedulerTiming,
  HistoryItem,
  schedulerTimingCodec
} from "@/shared/features/system";
import {
  ScheduledOperation,
  ScheduledOperationTimingKey,
  SchedulerSubscriptionState
} from "../types"
import { Temporal } from "@js-temporal/polyfill";

type HistoryItemTimes = Pick<HistoryItem, 'completed' | 'current'>;

const statusMapping: ScheduledOperation['status'][] = [
  'idle', 'queued', 'running'
];

const getStatus = (
  { completed, current }: HistoryItemTimes
): ScheduledOperation['status'] => {
  if (completed.length > 0 && current.length === 0) return 'completed';
  return statusMapping[current.length];
};

const getUTCReadable = (
  key: keyof DecodedSchedulerTiming, milliseconds?: number
) => {
  if (milliseconds === undefined) return;
  if (milliseconds === 0) return '0 ms';
  if (key === 'duration') return Temporal.Duration.from(
    { milliseconds }
  ).toLocaleString("en-GB", { style: "short" });
  return getRelativeTimeStringNow(
    getTemporalZonedDateTime(milliseconds)
  );
};

const transformUTCTimesToReadable = (value: HistoryItemTimes) => {
  const completed = schedulerTimingCodec.decode(value.completed);
  const currentTimings = schedulerTimingCodec.decode(value.current);

  return getObjectEntries(completed).reduce((acc, [key, milliseconds]) => {
    const prop: ScheduledOperationTimingKey = key === 'activated' ? 'started' : key;
    const completed = getUTCReadable(key, milliseconds);
    const current = getUTCReadable(key, currentTimings[key]);
    return {
      ...acc,
      [prop]: { completed, current }
    };
  }, {} as Record<
    ScheduledOperationTimingKey, Record<keyof HistoryItemTimes, string | undefined>
  >);
}

export const transformSchedulerStateHistoryToOperations = (
  state: SchedulerSubscriptionState['history'],
): ScheduledOperation[] => getObjectEntries(state).map(
  ([description, value]) => {
    const times = transformUTCTimesToReadable(value);
    return {
      ...times,
      description,
      status: getStatus({ completed: value.completed, current: value.current }),
      failures: value.failed,
    };
  }
);
