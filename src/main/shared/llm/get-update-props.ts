import { LanguageAnalysisState } from "./orchestration";
import { LanguageModelOrchestrationUpdateProps, LanguageModelResponseSchema } from "./types";

export const getRetryTimeout = (
  state: LanguageAnalysisState,
  payload: LanguageModelResponseSchema<unknown>
) => {
  if (payload.canRetry && payload.retryTimeout) return payload.retryTimeout;
  return state.retryTimeout;
}

export const getUpdateProps = <CompletionProps>(
  state: LanguageAnalysisState,
  payload: LanguageModelResponseSchema<CompletionProps>
): LanguageModelOrchestrationUpdateProps<CompletionProps> => ({
  attempts: {
    current: state.attempts,
    maximum: state.maximumAttempts,
  },
  payload,
  retryTimeout: getRetryTimeout(state, payload),
  willRetry: state.canAttempt,
});
