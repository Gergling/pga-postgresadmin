import {
  DecodedSchedulerTiming,
  SchedulerStateManagerSubscriberParams
} from "@/shared/features/system";

export type SchedulerSubscriptionState = SchedulerStateManagerSubscriberParams[
  'state'
];
type Timing = { completed?: string; current?: string; };
export type ScheduledOperationTimingKey = Exclude<
  keyof DecodedSchedulerTiming, 'activated'
> | 'started';
export type ScheduledOperation = {
  description: string;
  status: 'idle' | 'queued' | 'running' | 'completed';
  failures: number;
} & Record<ScheduledOperationTimingKey, Timing>;
