// This code is supposed to validate the text output from an LLM based on a
// schema object with validation functions for each property.
import {
  TASK_IMPORTANCE_NAMES,
  TASK_MOMENTUM_NAMES,
  TASK_VOTE_BASE_NAMES,
  TaskVoteBaseNames
} from "../../../../shared/features/user-tasks";
import { LlmResponseSchema, validateLanguageModelResponseArray } from "../../../llm/shared";
import { ProposedAnalysisResponse, ProposedTask } from "./proposed";

// Librarian-LLM-specific validation functions.
const proposedTaskResponseSchema: LlmResponseSchema<ProposedTask> = {
  importance: (value) => {
    const defaultValue: TaskVoteBaseNames = 'Awaiting';
    if (value === undefined) return { message: 'Importance undefined', success: false, value: defaultValue };

    const importanceNames: string[] = [...TASK_IMPORTANCE_NAMES, ...TASK_VOTE_BASE_NAMES];
    if (!importanceNames.includes(value)) return { message: `Importance must be one of ${importanceNames.join(', ')}. Got ${value}`, success: false, value: defaultValue };
    return { success: true, value };
  },
  momentum: (value) => {
    const defaultValue: TaskVoteBaseNames = 'Awaiting';
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
  source: (value) => {
    if (value === undefined) return { message: 'Source undefined.', success: false };
    if (typeof value !== 'object') return { message: `Source is not an object, found ${typeof value} instead.`, success: false };
    const noType = !('type' in value);
    const noId = !('id' in value);
    if (noType || noId) return { message: `Source must have a type and id property. Got: ${JSON.stringify(value)}`, success: false };
    return { success: true, value };
  },
  summary: (value) => {
    if (typeof value !== 'string') return { success: false, message: `Summary must be a string. Got ${typeof value}` };
    if (value.length === 0) return { success: false, message: 'Summary must not be empty.' };
    return { success: true, value };
  },
};
export const proposedTaskAnalysisResponseSchema: LlmResponseSchema<ProposedAnalysisResponse> = {
  proposed: (value) => validateLanguageModelResponseArray(value, proposedTaskResponseSchema),
};
