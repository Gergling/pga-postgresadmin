import { Queue } from "./types";

export const transformQueueForState = (
  queue: string[]
): Pick<Queue, 'hasQueue' | 'queue'> => ({
  hasQueue: queue.length > 0, queue,
});
