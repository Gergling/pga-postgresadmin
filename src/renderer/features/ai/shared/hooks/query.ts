import { trpcReact } from "@/renderer/libs/react-query";
import { getOperationCodes, getOperationFeature } from "@/shared/features/llm";
import { useMemo } from "react";

export type UseLlmOperationUtilsParams = {
  featureName: string;
  operationName: string;
} | {
  operationCode: string;
};
export const useLlmOperationUtils = (
  params: UseLlmOperationUtilsParams
) => {
  const utils = trpcReact.useUtils();
  const {
    featureName,
    operationCode,
    operationName,
  } = useMemo(
    () => {
      if ('operationCode' in params) {
        return {
          ...params,
          ...getOperationFeature(params.operationCode),
        };
      };
      const operationCode = getOperationCodes(params.featureName)
        .getCode(params.operationName);
      return { ...params, operationCode }
    },
    [params]
  );

  const invalidate = () => utils.ai.readOperationSummaries.invalidate();

  return { invalidate, operationCode, featureName, operationName };
};
