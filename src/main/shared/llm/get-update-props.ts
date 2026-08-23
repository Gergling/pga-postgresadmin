import { LanguageModelResponseSchema, LlmCoreIdentifier } from "@/shared/features/llm";
import { LanguageAnalysisState } from "./orchestration";
import { LanguageModelOrchestrationUpdateProps } from "./types";

export const getRetryTimeout = (
  state: LanguageAnalysisState<unknown>,
  payload: LanguageModelResponseSchema<unknown>
) => {
  if (payload.canRetry && payload.retryTimeout) return payload.retryTimeout;
  return state.retryTimeout;
}

export const getUpdateProps = <CompletionProps>(
  state: LanguageAnalysisState<CompletionProps>,
  payload: LanguageModelResponseSchema<CompletionProps>,
  llm: LlmCoreIdentifier,
): LanguageModelOrchestrationUpdateProps<CompletionProps> => ({
  attempts: {
    current: state.attempts,
    maximum: state.maximumAttempts,
  },
  llm,
  payload,
  retryTimeout: getRetryTimeout(state, payload),
  type: 'custom',
  willRetry: state.canAttempt,
});
