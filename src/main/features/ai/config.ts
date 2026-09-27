import { configureLanguageModelStrategies } from "@/main/shared";
import { googleLanguageModelConfig } from "@/main/libs/google-gen-ai";
import { ollamaLanguageModelConfig } from "@/main/libs/ollama";

export const {
  analyser: runLanguageModel,
  fetchAvailableModels,
} = configureLanguageModelStrategies([
  googleLanguageModelConfig,
  ollamaLanguageModelConfig,
]);
