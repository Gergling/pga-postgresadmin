// This code is supposed to validate the text output from an LLM based on a
// schema object with validation functions for each property.
import { TASK_IMPORTANCE_NAMES, TASK_MOMENTUM_NAMES, TASK_VOTE_BASE_NAMES, TaskVoteBase } from "../../../../shared/features/user-tasks";
import { LlmResponseSchema, validateLanguageModelResponseArray } from "../../shared";
import { FragmentAnalysisResponse, SuggestedTask } from "../types/prompt";

// Librarian-LLM-specific validation functions.
const suggestedTaskResponseSchema: LlmResponseSchema<SuggestedTask> = {
  importance: (value) => {
    const defaultValue: TaskVoteBase = 'Awaiting';
    if (value === undefined) return { message: 'Importance undefined', success: false, value: defaultValue };

    const importanceNames: string[] = [...TASK_IMPORTANCE_NAMES, ...TASK_VOTE_BASE_NAMES];
    if (!importanceNames.includes(value)) return { message: `Importance must be one of ${importanceNames.join(', ')}. Got ${value}`, success: false, value: defaultValue };
    return { success: true, value };
  },
  momentum: (value) => {
    const defaultValue: TaskVoteBase = 'Awaiting';
    if (value === undefined) return { message: 'Momentum undefined', success: false, value: defaultValue };

    const momentumNames: string[] = [...TASK_MOMENTUM_NAMES, ...TASK_VOTE_BASE_NAMES];
    if (!momentumNames.includes(value)) return { message: `Momentum must be one of ${momentumNames.join(', ')}. Got ${value}`, success: false, value: defaultValue };
    return { success: true, value };
  },
  reasoning: (value) => {
    if (typeof value !== 'string') return { success: false, message: `Reasoning must be a string. Got ${typeof value}` };
    if (value.length === 0) return { success: false, message: 'Reasoning must not be empty.' };
    return { success: true, value };
  },
  summary: (value) => {
    if (typeof value !== 'string') return { success: false, message: `Summary must be a string. Got ${typeof value}` };
    if (value.length === 0) return { success: false, message: 'Summary must not be empty.' };
    return { success: true, value };
  },
};
export const fragmentAnalysisResponseSchema: LlmResponseSchema<FragmentAnalysisResponse> = {
  // entityUpdate: (value) => ({ success: true, value }),
  suggestedTasks: (value) => validateLanguageModelResponseArray(value, suggestedTaskResponseSchema),
};
