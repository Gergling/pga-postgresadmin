import { EmailFragment } from "../../email/types";
import { DiaryEntry } from "../diary/types";
import { UserTask } from "../user-tasks";

type TriageProps<
  T extends object,
  MandatoryProps extends keyof T = keyof T,
  OptionalProps extends keyof T = keyof T,
>
= Pick<T, MandatoryProps>
& Partial<Pick<T, OptionalProps>>;

export type RitualTelemetrySubscriptionParams = {
  // Always supply a summary message and a timestamp for when this was sent. JIC I want it.
  message: string; // There should always be a summary message.
  timestamp: number;

  // This is the "real" payload. It can be omitted entirely if it's not extensive.
  triage?: {
    diary?: TriageProps<DiaryEntry, 'id', 'created' | 'status'>[];
    email?: TriageProps<EmailFragment, 'id', 'receivedAt' | 'status'>[];
    tasks?: UserTask[]; // For updating the state with newly-proposed tasks.
  };
  votes?: {
    // We should have the task level changes, but we can scope that properly later.
    // All tasks will be "active", so to-do or doing.
    tasks?: Pick<UserTask, 'id' | 'votes'>[];
  };
};
