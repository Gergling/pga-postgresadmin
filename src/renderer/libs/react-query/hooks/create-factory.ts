import { useMutation } from "@tanstack/react-query";
import { ArchetypeMapEntryDefault } from "../../../../shared/lib/typesaurus";
import { useQueryDataFactory } from "./cache";

export const useIpcCreateFactory = <
  ArchetypeMapEntryBase extends ArchetypeMapEntryDefault['base'],
  CreationPayload extends Omit<ArchetypeMapEntryBase, 'id'> = Omit<ArchetypeMapEntryBase, 'id'>,
  OnSuccessFnc extends (data: ArchetypeMapEntryBase) => void = (data: ArchetypeMapEntryBase) => void,
>(
  ipcCreateFunction: (payload: CreationPayload) => Promise<ArchetypeMapEntryBase>,
  queryBaseName: string,
  hydrator: (payload: Partial<CreationPayload>) => CreationPayload,
) => {
  const setQueryData = useQueryDataFactory<ArchetypeMapEntryBase>(queryBaseName);

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
