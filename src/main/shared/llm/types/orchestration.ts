import z from "zod";
import {
  languageModelHistoryBaseStatusSchema,
  LanguageModelProps,
  LanguageModelResponseSchema,
  LlmCoreIdentifier
} from "@/shared/features/llm";
import { LogApi } from "@/main/shared/logging";

export type LanguageModelOrchestrationListFunction = (props: {
  attempts: number;
  excluded: LlmCoreIdentifier[];
  logApi: LogApi;
  operation: string;
  preferred: LlmCoreIdentifier[];
}) => Promise<LanguageModelProps | undefined>;

export type LanguageModelOrchestrationUpdatePayloadTypeProps<SuccessPayload> = {
  type: 'custom';
  payload: LanguageModelResponseSchema<SuccessPayload>;
} | {
  type: 'string';
  payload: LanguageModelResponseSchema<string>;
};
export type LanguageModelOrchestrationUpdateProps<SuccessPayload> =
  & LanguageModelOrchestrationUpdatePayloadTypeProps<SuccessPayload>
  & {
    // Derived:
    attempts: {
      current: number;
      maximum: number;
    };
    llm: LlmCoreIdentifier;
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

export const llmRunCoreStarted = z.object({
  model: z.string(),
  source: z.string(),
});
export const llmRunCore = llmRunCoreStarted.extend({
  runtime: z.number(),
  status: languageModelHistoryBaseStatusSchema,
});
export type LlmRunCore = z.infer<typeof llmRunCore>;
