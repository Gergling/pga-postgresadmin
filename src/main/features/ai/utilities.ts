import { Optional } from "@shared/types";
import { emitRitualTelemetry } from "./ipc";
import { RitualTelemetrySubscriptionParams } from "@shared/features/ai";

export type HandleRitualTelemetryProps<Returns extends Promise<unknown>> = Optional<
  Omit<RitualTelemetrySubscriptionParams, 'status'>, 'retried' | 'timestamp'
> & {
  fn: () => Returns,
};

export const handleRitualTelemetry = async <
  Returns extends Promise<unknown>
>({
  fn, retried = 0, ...props
}: HandleRitualTelemetryProps<Returns>): Promise<Returns> => {
  emitRitualTelemetry({ ...props, retried, status: 'started' });
  try {
    const result = await fn();
    emitRitualTelemetry({ ...props, retried, status: 'successful' });
    return result;
  } catch (e) {
    console.error(e);
    emitRitualTelemetry({ ...props, retried, status: 'failed' });
    throw e;
  }
};
