import {
  LanguageModelHistoryBase,
  languageModelHistorySchema,
  LanguageModelLeading,
  OperationGroup
} from "./schema";

export const transformLlmLeadingHistory = (
  data: LanguageModelHistoryBase[]
): LanguageModelLeading[] => {
  const records = data.map((value) => {
    const parsed = languageModelHistorySchema.parse(value);
    return parsed;
  });
  console.log('records', records)
  const groupedByOperation = new Map<string, OperationGroup>();

  records.forEach((record) => {
    const operationGroup: OperationGroup = groupedByOperation.get(
      record.operation
    ) ?? new OperationGroup({ name: record.operation });
    operationGroup.add(record);
    groupedByOperation.set(record.operation, operationGroup);
  });

  console.log('groups', [...groupedByOperation.values()])

  const list = Array.from(groupedByOperation.values()).map((operationGroup) => {
    const { chosen, experimental, stable } = operationGroup.values;
    return {
      chosen,
      experimental,
      name: operationGroup.name,
      stable,
    };
  });

  console.log('list', list)

  return list;
}
