import {
  LanguageModelHistoryBase,
  summariseLlmHistory,
  summariseLlmRelativeHistory
} from "@/shared/features/llm";
import { LogApi } from "../../logging";
import {
  listLlmSummaries,
  readLlmHistory,
  upsertLlmHistorySummary,
  upsertLlmOperation
} from "../crud";

export const llmSummariseOperation = (
  operation: string, { log }: LogApi
) => log(
  `Summarising history for ${operation}`, async ({ log }) => {
    // Fetch all the raw history for the operation.
    const data = await log(
      `Finding history records for "${operation}"`,
      () => readLlmHistory(operation)
    );

    // Summarise into a model/operation aggregation.
    const summarisation = summariseLlmHistory(data);

    // Start the summarised upsert. This is mainly a cache at the moment, so we
    // don't really need to wait on it.
    const awaitSummarisationUpsert = log(
      `Summarising and caching ${summarisation.length} model operation summaries`,
      () => Promise.all(summarisation.map(
        upsertLlmHistorySummary
      ))
    );

    // Fetch the entire model cache. We probably don't need all of them, but
    // it's maybe a few hundred records and mainly we need the model traits for
    // the operation upsert.
    const models = await log(
      `Listing all models`, listLlmSummaries
    );

    const modelMap = new Map(
      models.map((props) => [[props.source, props.model], props])
    );

    const summarisationWithModels = summarisation.map((summary) => ({
      ...summary,
      traits: (modelMap.get([summary.source, summary.model])?.traits ?? {
        local: false
      })
    }));

    // Transform model/operation level summaries into operation-level summaries.
    const operationSummaries = summariseLlmRelativeHistory(
      summarisationWithModels
    );

    await log(`Upserting operation summaries and finalising`, () => Promise.all([
      upsertLlmOperation(operation, operationSummaries),
      awaitSummarisationUpsert
    ]));
  }
);
