import { Queue } from "./types";

export const transformActivityForState = (
  active: string[]
): Pick<Queue, 'active' | 'activity' | 'hasActivity'> => ({
  active, activity: active.length, hasActivity: active.length > 0
});
