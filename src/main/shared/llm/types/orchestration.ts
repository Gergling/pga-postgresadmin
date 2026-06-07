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

// type ParameterValue = 'preferred' | 'required';
// type ModelParameters = {
//   [K in keyof Partial<LanguageModelProps>]: {
//     type: ParameterValue;
//     value: LanguageModelProps[K];
//   };
// };
// const computeParameters = (): ModelParameters => {
//   // If no internet, local is a requirement. Need to find internet.
//   // If no system resources, remote is the preference.
//   // If no internet OR system resources, should probably check with the user first. Would ideally looking into ensuring it doesn't eat the whole processor, but just waits until available or something.
// };

// export type LanguageModelSelectionParameters = {
//   available: {
//     internet: boolean;
//   };
// };
