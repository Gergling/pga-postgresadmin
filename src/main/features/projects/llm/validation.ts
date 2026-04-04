import { LlmResponseSchema } from "@main/llm/shared";
import { CommitMessage, CONVENTIONAL_COMMIT_SCOPE, CONVENTIONAL_COMMIT_TYPES } from "@shared/features/projects";


export const commitMessageSuggestionResponseSchema: LlmResponseSchema<
  CommitMessage
> = {
  body: (value) => {
    if (typeof value !== 'string') return {
      success: false, message: `Body must be a string. Got ${typeof value}`
    };
    if (value.length === 0) return {
      success: false, message: 'Body must not be empty.'
    };
    return { success: true, value };
  },
  scope: (value) => {
    if (value === undefined) return { success: true, value: undefined };
    if (!CONVENTIONAL_COMMIT_SCOPE.includes(value)) return {
      success: false,
      message: `Scope must be one of ${CONVENTIONAL_COMMIT_SCOPE.join(', ')}. Got ${value}`
    };
    return { success: true, value };
  },
  summary: (value) => {
    if (typeof value !== 'string') return {
      success: false, message: `Summary must be a string. Got ${typeof value}`
    };
    if (value.length === 0) return {
      success: false, message: 'Summary must not be empty.'
    };
    return { success: true, value };
  },
  type: (value) => {
    if (!CONVENTIONAL_COMMIT_TYPES.includes(value)) return {
      success: false,
      message: `Type must be one of ${CONVENTIONAL_COMMIT_TYPES.join(', ')}. Got ${value}`
    };
    return { success: true, value };
  },
};
