import z from "zod";

export const releaseUpdateStep = z.enum([
  'idle', 'available', 'downloading', 'ready'
]).default('idle');
export type ReleaseUpdateStep = z.infer<typeof releaseUpdateStep>;
