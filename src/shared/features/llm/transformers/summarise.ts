import {
  LanguageModelHistoryBase,
  languageModelHistorySchema,
} from "../schema";
import { OperationGroup } from "./summary";

const getOperationGroup = (
  map: Map<string, OperationGroup>,
  record: LanguageModelHistoryBase
): OperationGroup => {
  const operationGroup = map.get(record.operation)
  return operationGroup ? operationGroup.add(record) : new OperationGroup(record);
};

export const transformLlmLeadingHistory = (
  data: LanguageModelHistoryBase[]
): OperationGroup[] => {
  const records = data.map((value) => {
    const parsed = languageModelHistorySchema.parse(value);
    return parsed;
  });
  const groupedByOperation = new Map<string, OperationGroup>();

  records.forEach((record) => {
    const operationGroup = getOperationGroup(groupedByOperation, record);
    groupedByOperation.set(record.operation, operationGroup);
  });

  return Array.from(groupedByOperation.values());
}
