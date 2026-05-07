import { configureLanguageModelStrategies } from "@/main/shared";
import { googleLanguageModelConfig } from "@/main/libs/google-gen-ai";

export const runLanguageModel = configureLanguageModelStrategies([
  googleLanguageModelConfig,
  // TODO: Local.
]);
