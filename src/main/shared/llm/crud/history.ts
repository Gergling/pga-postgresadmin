import { setupBasicNeDb } from "@/main/libs/nedb";
import {
  LanguageModelHistoryBase,
  languageModelHistoryBaseSchema,
  llmParseHistory
} from "@/shared/features/llm";
import { Optional } from "@/shared/types";
import z from "zod";

const history = setupBasicNeDb<LanguageModelHistoryBase>('language-model-history');
history.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

const historyBaseSchema = z.object({
  ...languageModelHistoryBaseSchema.shape,
  timestamp: z.number().catch(-1),
});

export const readLlmHistory = async (
  operation: string
) => {
  const data = await history.db.findAsync({ operation });
  return data.map((item) => historyBaseSchema.parse(item));
};

/**
 * @deprecated Best check whether this is still required.
 * @param source 
 * @param model 
 * @returns 
 */
export const readLlmHistoryBySourceAndModel = async (
  source: string, model: string
) => {
  const data = await history.db.findAsync({ source, model });
  return llmParseHistory(data);
}

export const insertLlmHistory = (
  data: Optional<LanguageModelHistoryBase, 'timestamp'>
) => history.insert({ ...data, timestamp: Date.now() });
