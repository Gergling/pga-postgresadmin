import { Task } from "tasuku";
import { LanguageModelProps } from "./base";
import { LanguageModelResponseSchema } from "./schema";

export type LanguageModelOrchestrationListFunction = (
  preferred: string[],
  excluded: string[],
  task: Task
) => Promise<LanguageModelProps | undefined>;

export type LanguageModelOrchestrationUpdateProps<SuccessPayload> = {
  payload: LanguageModelResponseSchema<SuccessPayload | string>;

  // Derived:
  attempts: {
    current: number;
    maximum: number;
  };
  retryTimeout: number;
  willRetry: boolean;
};

export type LanguageModelOrchestrationUpdateFunction<SuccessPayload> = (
  props: LanguageModelOrchestrationUpdateProps<SuccessPayload>
) => void;
