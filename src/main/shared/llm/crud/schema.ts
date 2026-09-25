import { setupBasicNeDb } from "@/main/libs/nedb";
import { Optional } from "@/shared/types";
import {
  LanguageModelHistoryBase,
  LlmOperationSummary,
  SerialisedModelSummary,
  SerialisedOperationSummary,
  SerialisedOperationSummaryReliability,
  serialisedOperationSummaryReliabilityKeys,
  serialisedOperationSummarySchema,
} from "@/shared/features/llm";
import {
  OperationGroup
} from "@/shared/features/llm/transformers/operation/summary";
import { LogApi } from "../../logging";
import {
  transformLlmModelHistory,
  transformLlmOperationHistory
} from "@/shared/features/llm/transformers/operation/class";
import {
  insertLlmHistory,
  readLlmHistory,
  readLlmHistoryBySourceAndModel
} from "./history";

const operationSummaryDb = setupBasicNeDb<SerialisedOperationSummary>('language-model-operation');
operationSummaryDb.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

/**
 * @deprecated Use `insertLlmHistory`.
 * @param data 
 * @returns 
 */
export const llmModelRunInsert = (
  data: Optional<LanguageModelHistoryBase, 'timestamp'>
) => insertLlmHistory(data);

export const llmReadSummarisedModelHistory = async (
  source: string, model: string
) => {
  const history = await readLlmHistoryBySourceAndModel(source, model);
  return transformLlmModelHistory(history);
}

const llmReadSummarisedOperationHistory = async (
  operation: string, { log }: LogApi
) => log(`Reading operation history: "${operation}"`, async ({ log }) => {
  const operationResults = await readLlmHistory(operation);
  return transformLlmOperationHistory(operationResults);
});

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
) => log(`Summarising operation: "${operation}"`, async (logApi) => {
  const summarisedOperations = await llmReadSummarisedOperationHistory(
    operation, logApi
  );

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

const createSummarisedOperationTransformer = (
  reliability: SerialisedOperationSummaryReliability
) => (summary: SerialisedOperationSummary): LlmOperationSummary => {
  const parsed = serialisedOperationSummarySchema.parse(summary);
  console.log('get bent', reliability, parsed)
  return {
    ...parsed[reliability],
    operation: parsed.name,
    reliability,
  };
};

export const llmReadModelOperationSummaries = async (
  source: string, model: string
): Promise<LlmOperationSummary[]> => {
  const data = await Promise.all(
    serialisedOperationSummaryReliabilityKeys.map(
      (reliability) => operationSummaryDb.db.findAsync({
        $and: [
          { [`${reliability}.source`]: source },
          { [`${reliability}.name`]: model },
        ],
      })
    )
  );
  return serialisedOperationSummaryReliabilityKeys.reduce(
    (acc, reliability, i) => [
      ...acc,
      ...data[i].map(
        createSummarisedOperationTransformer(reliability)
      )
    ], []
  );
}
