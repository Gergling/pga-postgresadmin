import { setupBasicNeDb } from "@/main/libs/nedb";
import {
  LlmHistorySummary,
} from "@/shared/features/llm";

const summaries = setupBasicNeDb<LlmHistorySummary>(
  'language-model-operation-summaries'
);
summaries.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

export const upsertLlmHistorySummary = (summary: LlmHistorySummary) => {
  const { source, model, operation } = summary;
  return summaries.db.updateAsync({
    source, model, operation
  }, summary, { upsert: true });
};
