import { nowUTCMs } from "@/shared/utilities";
import {
  LlmHistoryRelative,
  LlmOperation,
  llmOperationSchema,
} from "@/shared/features/llm";
import { setupBasicNeDb } from "@/main/libs/nedb";
import { LogApi } from "../../logging";

const operationSummaries = setupBasicNeDb<LlmOperation>(
  'llm-operation-summaries'
);
operationSummaries.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

// TODO: Reading operations to be done through llmOperationSchema

const parseLlmSummary = async (
  item: LlmOperation, { log }: LogApi
): Promise<LlmOperation | undefined> => {
  const parsed = llmOperationSchema.safeParse(item);
  if (parsed.success) return parsed.data;
  await log(
    `Removing unparseable LLM operation summary: ${JSON.stringify(item)}`,
    () => operationSummaries.db.removeAsync(item, {})
  );
}

export const listLlmOperations = async (
  logApi: LogApi
): Promise<LlmOperation[]> => {
  const response = await operationSummaries.db.findAsync({});
  const parsed = await Promise.all(response.map(
    (item) => parseLlmSummary(item, logApi)
  ));
  return parsed.filter((item): item is LlmOperation => !!item);
}

export const upsertLlmOperation = async (
  operation: string, models: LlmHistoryRelative[]
) => {
  const summary: LlmOperation = {
    operation,
    models,
    updated: nowUTCMs(),
  };
  return operationSummaries.db.updateAsync({
    operation
  }, summary, { upsert: true });
};
