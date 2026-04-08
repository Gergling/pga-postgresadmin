import { Model } from "@google/genai";

const getModelFallbackFilterFactory = (tried: string[]) => ({
  name,
  supportedActions
}: Model) => {
  // If it doesn't support generating contents, I can't use it.
  if (supportedActions && !supportedActions.includes('generateContent')) {
    return false;
  }

  // I don't trust models without a name.
  if (!name) return false;

  // If I've already tried it, not point in trying again.
  const alreadyTried = tried.includes(name);
  if (alreadyTried) return false;

  // Otherwise, we use this one.
  return true;
};

const compareModels = (a: Model, b: Model) => {
  // Thinking models go at the top.
  if (a.thinking !== b.thinking) {
    if (a.thinking) return -1;
    return 1;
  }
  // Descending inputTokenLimit
  if (a.inputTokenLimit !== b.inputTokenLimit) {
    if (a.inputTokenLimit === undefined) return -1;
    if (b.inputTokenLimit === undefined) return 1;
    if (a.inputTokenLimit > b.inputTokenLimit) return -1;
    return 1;
  }
  // Descending outputTokenLimit
  if (a.outputTokenLimit !== b.outputTokenLimit) {
    if (a.outputTokenLimit === undefined) return -1;
    if (b.outputTokenLimit === undefined) return 1;
    if (a.outputTokenLimit > b.outputTokenLimit) return -1;
    return 1;
  }
  // topP and temperature ideally lower for most things (unless we want
  // unbridled *creativity*).
  if (a.temperature !== b.temperature) {
    if (a.temperature === undefined) return -1;
    if (b.temperature === undefined) return 1;
    if (a.temperature < b.temperature) return -1;
    return 1;
  }
  return 0;
};

export const getFallbackModel = (
  models: Model[], tried: string[]
): Model | undefined => {
  const model = models
    .filter(getModelFallbackFilterFactory(tried))
    .sort(compareModels)
  ;
  return model[0];
};
