import { useMutation } from "@tanstack/react-query";
import { WithId } from "../../../../shared/lib/typesaurus";
import { useQueryDataFactory } from "./cache";

export const useIpcCreateFactory = <
  TransferPayload extends WithId<string>,
  CreationPayload extends object & { id?: never; },
  OnSuccessFnc extends (data: TransferPayload) => void = (data: TransferPayload) => void,
  FormPayload extends object = CreationPayload
>(
  ipcCreateFunction: (payload: CreationPayload) => Promise<TransferPayload>,
  queryBaseName: string,
  hydrator: (payload: Partial<FormPayload>) => CreationPayload,
) => {
  const setQueryData = useQueryDataFactory<TransferPayload>(queryBaseName);

  const {
    mutate,
    isError: createIsError,
    error: createError,
    isPending: createIsPending,
  } = useMutation({
    mutationFn: ({ payload }: {
      payload: CreationPayload;
      onSuccess?: OnSuccessFnc;
    }) => ipcCreateFunction(hydrator(payload)),
    onSuccess: (createdData, variables) => {
      setQueryData(createdData);
      if (variables.onSuccess) variables.onSuccess(createdData);
    },
  });
  const create = (
    payload: CreationPayload,
    onSuccess?: OnSuccessFnc,
  ) => {
    mutate({ payload, onSuccess });
  };

  return {
    create,
    createError,
    createIsError,
    createIsPending,
  };
};
