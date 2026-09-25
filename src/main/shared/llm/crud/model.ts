import { setupBasicNeDb } from "@/main/libs/nedb";
import { LlmSummary, llmSummarySchema } from "@/shared/features/llm";
import { nowUTCMs } from "@/shared/utilities";
import { LogApi } from "../../logging";

const modelSummaries = setupBasicNeDb<LlmSummary>('language-model-summaries');
modelSummaries.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

const parseLlmSummary = async (
  item: LlmSummary, { log }: LogApi
): Promise<LlmSummary | undefined> => {
  const parsed = llmSummarySchema.safeParse(item);
  if (parsed.success) return parsed.data;
  await log(
    `Removing unparseable LLM summary: ${JSON.stringify(item)}`,
    () => modelSummaries.db.removeAsync(item, {})
  );
}

const readLlmSummary = async (
  params: Pick<LlmSummary, 'model' | 'source'>, logApi: LogApi
): Promise<LlmSummary | undefined> => {
  const response = await modelSummaries.db.findOneAsync(params);
  if (!response) return;
  return parseLlmSummary(response, logApi);
}
export const listLlmSummaries = async (logApi: LogApi): Promise<LlmSummary[]> => {
  const response = await modelSummaries.db.findAsync({});
  const parsed = await Promise.all(response.map(
    (item) => parseLlmSummary(item, logApi)
  ));
  return parsed.filter((item): item is LlmSummary => !!item);
}

type UpsertLlmBaseParams = Omit<LlmSummary, 'updated'>;
type UpsertLlmFetchParams = Omit<UpsertLlmBaseParams, 'operations'>;
const transformTraitsUpsert = (
  existing: LlmSummary | undefined,
  params: UpsertLlmFetchParams
): LlmSummary => ({
  operations: [],
  ...existing,
  ...params,
  updated: { ...existing?.updated, fetch: nowUTCMs() },
});
export const upsertLlmTraits = async (
  params: UpsertLlmFetchParams, logApi: LogApi
) => {
  const { model, source } = params;
  const existing = await readLlmSummary({ model, source }, logApi);
  const data = transformTraitsUpsert(existing, params);
  return modelSummaries.db.updateAsync({
    source, model
  }, data, { upsert: true });
};


type UpsertLlmSummarisationParams = Omit<UpsertLlmBaseParams, 'traits'>;
const transformSummarisationUpsert = (
  existing: LlmSummary | undefined,
  params: UpsertLlmSummarisationParams
): LlmSummary => ({
  traits: { local: false },
  ...existing,
  ...params,
  updated: {
    fetch: existing?.updated.fetch ?? nowUTCMs(),
    summarisation: nowUTCMs()
  },
});
export const upsertLlmSummaryData = async (
  params: UpsertLlmSummarisationParams, logApi: LogApi
) => {
  const { model, source } = params;
  const existing = await readLlmSummary({ model, source }, logApi);
  const data = transformSummarisationUpsert(existing, params);
  return modelSummaries.db.updateAsync({
    source, model
  }, data, { upsert: true });
};

