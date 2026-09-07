import {
  LanguageModelHistoryBase,
  languageModelHistorySchema,
  SerialisedModelSummary,
} from "../schema";
import { llmParseHistory } from "./history";
import { ModelGroup } from "./model";
import { OperationGroup } from "./summary";

const getOperationGroup = (
  map: Map<string, OperationGroup>,
  record: LanguageModelHistoryBase
): OperationGroup => {
  const operationGroup = map.get(record.operation)
  return operationGroup ? operationGroup.add(record) : new OperationGroup(record);
};

export const transformLlmOperationHistory = (
  data: LanguageModelHistoryBase[]
): OperationGroup[] => {
  const records = llmParseHistory(data);
  const groupedByOperation = new Map<string, OperationGroup>();

  records.forEach((record) => {
    const operationGroup = getOperationGroup(groupedByOperation, record);
    groupedByOperation.set(record.operation, operationGroup);
  });

  return Array.from(groupedByOperation.values());
}

/**
 * Alias for transformLlmOperationHistory.
 * @deprecated Use transformLlmOperationHistory instead.
 * @param data 
 * @returns 
 */
export const transformLlmLeadingHistory = transformLlmOperationHistory;

export const transformLlmModelHistory = (
  data: LanguageModelHistoryBase[]
): SerialisedModelSummary[] => {
  const groupedByModel = new Map<string, ModelGroup>();

  data.forEach((record) => {
    const modelKey = `${record.source}-${record.model}`;
    const modelGroup: ModelGroup = groupedByModel.get(
      modelKey
    ) ?? new ModelGroup(record);

    // Model group has history data added.
    modelGroup.add(record);
  });

  return Array.from(groupedByModel.values()).map(group => group.serialised);
};
