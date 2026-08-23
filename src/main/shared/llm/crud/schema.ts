import { setupBasicNeDb } from "@/main/libs/nedb";
import { Optional } from "@/shared/types";
import {
  LanguageModelHistoryBase,
  SerialisedModelSummary,
  SerialisedOperationSummary,
  serialisedOperationSummarySchema,
  transformLlmLeadingHistory
} from "@/shared/features/llm";
import { OperationGroup } from "@/shared/features/llm/transformers/summary";
import { LogApi } from "../../logging";

const history = setupBasicNeDb<LanguageModelHistoryBase>('language-model-history');
history.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

const operationSummaryDb = setupBasicNeDb<SerialisedOperationSummary>('language-model-operation');
operationSummaryDb.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

export const llmModelRunInsert = (
  data: Optional<LanguageModelHistoryBase, 'timestamp'>
) => history.insert({ ...data, timestamp: Date.now() });

export const llmModelReadLeading = async () => {
  const data = await history.db.findAsync({ status: 'success' });
  return transformLlmLeadingHistory(data);
}
export const llmModelReadOperation = async (operation: string) => {
  const data = await history.db.findAsync({ operation, status: 'success' });
  return transformLlmLeadingHistory(data);
}

const llmSummariseOperations = (
  operationGroups: OperationGroup[]
) => Promise.all(operationGroups.map(
  (operationGroup) => operationSummaryDb.db.updateAsync(
    { name: operationGroup.name },
    operationGroup.serialised,
    { upsert: true }
  )
));

export const llmSummariseOperation = async (
  operation: string, { log }: LogApi
) => log(`Summarising operation: "${operation}"`, async ({ log }) => {
  const operationResults = await log(
    `Reading operation history for "${operation}"`,
    () => history.db.findAsync({ operation })
  );

  const summarisedOperations = transformLlmLeadingHistory(operationResults);

  const awaitingSummarisation = llmSummariseOperations(summarisedOperations);
  const awaitingCleanup = Promise.all(summarisedOperations.reduce(
    (awaiting, operationGroup) => {
      operationGroup.groupedByModel.forEach((modelGroup) => {
        modelGroup.selectCleanupModels.forEach(({
          model, operation, source, timestamp
        }) => {
          awaiting.push(log(
            `Removing old record for ${source}:${model} (@ ${timestamp}) in "${operation}"`,
            () => Promise.all([
              operationSummaryDb.db.removeAsync(
                { model, operation, source, timestamp: { $lte: timestamp } }, {}
              ),
              // This one is just to make sure...
              operationSummaryDb.db.removeAsync(
                { model, operation, source, timestamp: { $lte: 0 } }, {}
              )
            ])
          ));
        });
      });
      return awaiting;
    },
    [] as Promise<unknown>[]
  ));

  await Promise.all([awaitingCleanup, awaitingSummarisation]);
});

export const llmReadOperationSummary = async (name: string): Promise<
  SerialisedOperationSummary | undefined
> => operationSummaryDb.db.findOneAsync({ name });

export const llmListOperationSummaries = async () => {
  const summaries = await operationSummaryDb.db.findAsync({});
  return summaries.map((summary) => serialisedOperationSummarySchema.parse(summary));
}
