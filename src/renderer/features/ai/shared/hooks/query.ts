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
  // TODO: Operation will have to go through runtime validation unless I'm
  // brave enough to implement a list of hard-typed operations.
  // I CAN do that through a config of some kind as long as it's in shared.
  // const {
  //   data,
  //   isLoading: modelsIsLoading,
  //   isError: modelsIsError,
  //   error: modelsError,
  // } = trpcReact.ai.readOperationModelSummaries.useQuery(name);

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

  const invalidate = () => utils.ai.readOperationModelSummaries.invalidate(operationCode);

  return { invalidate, operationCode, featureName, operationName };
};
