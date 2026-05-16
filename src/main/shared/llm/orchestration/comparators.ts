import { LanguageModelProps } from "../types";

export const compareLanguageModels = (
  a: LanguageModelProps, b: LanguageModelProps
) => {
  // Thinking models go at the top.
  if (a.thinking !== b.thinking) {
    if (a.thinking) return -1;
    if (b.thinking) return 1;
    // If we know one model is not a thinking model, and we don't know about
    // the other one, we can assume the other one *might* be.
    if (a.thinking === undefined) return -1;
    return 1;
  }

  // Descending inputTokenLimit
  if (a.tokenLimits.input !== b.tokenLimits.input) {
    if (a.tokenLimits.input === undefined) return -1;
    if (b.tokenLimits.input === undefined) return 1;
    if (a.tokenLimits.input > b.tokenLimits.input) return -1;
    return 1;
  }

  // Descending outputTokenLimit
  if (a.tokenLimits.output !== b.tokenLimits.output) {
    if (a.tokenLimits.output === undefined) return -1;
    if (b.tokenLimits.output === undefined) return 1;
    if (a.tokenLimits.output > b.tokenLimits.output) return -1;
    return 1;
  }

  // Temperature ideally lower for most things (unless we want unbridled
  // *creativity*).
  if (a.temperature !== b.temperature) {
    if (a.temperature === undefined) return -1;
    if (b.temperature === undefined) return 1;
    if (a.temperature < b.temperature) return -1;
    return 1;
  }
  return 0;
};
