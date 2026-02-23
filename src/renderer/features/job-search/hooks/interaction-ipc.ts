import { useMutation, useQuery } from "@tanstack/react-query";
import { hydrateJobSearchInteraction, JobSearchArchetype } from "../../../../shared/features/job-search";
import { useQueryDataFactory } from "../../../libs/react-query";
import { useIpc } from "../../../shared/ipc";

type Interaction = JobSearchArchetype['base']['interactions'];
type NewInteraction = Omit<Interaction, 'id'>;

const useQueryData = () => useQueryDataFactory<Interaction>('interactions');

const useJobSearchInteractionIpcCreate = () => {
  const setQueryData = useQueryData();
  const { createInteraction: createInteractionIpc } = useIpc();

  const {
    mutate: createInteractionMutate,
    isError: createInteractionIsError,
    error: createInteractionError,
    isPending: createInteractionIsPending,
  } = useMutation({
    mutationFn: ({ payload }: {
      payload: NewInteraction;
      onSuccess?: (data: Interaction) => void;
    }) => createInteractionIpc(hydrateJobSearchInteraction(payload)),
    onSuccess: (interaction, variables) => {
      setQueryData(interaction);
      if (variables.onSuccess) variables.onSuccess(interaction);
    },
  });
  const createInteraction = (
    newInteraction: NewInteraction,
    onSuccess?: (interaction: Interaction) => void,
  ) => createInteractionMutate({ payload: newInteraction, onSuccess });

  return {
    createInteraction,
    createInteractionError,
    createInteractionIsError,
    createInteractionIsPending,
  };
};

export const useJobSearchInteractionsIpc = () => {
  const { fetchRecentInteractions, updateInteraction } = useIpc();
  const setQueryData = useQueryData();

  const create = useJobSearchInteractionIpcCreate();

  // Read
  const {
    data: interactions,
    isLoading: fetchActiveInteractionsIsLoading,
    isError: fetchActiveInteractionsIsError,
    error: fetchActiveInteractionsError,
  } = useQuery({
    queryKey: ['interactions'],
    queryFn: fetchRecentInteractions,
    select: (models) => new Map(models.map((model) => [model.id, model])),
  });

  // Update
  const {
    mutate: updateInteractionMutation,
    isError: updateInteractionIsError,
    error: updateInteractionError,
  } = useMutation({
    mutationFn: updateInteraction,
    onSuccess: setQueryData,
  });

  return {
    interactions,
    ...create,
    fetchActiveInteractionsError,
    fetchActiveInteractionsIsError,
    fetchActiveInteractionsIsLoading,
    updateInteractionError,
    updateInteractionIsError,
    updateInteraction: updateInteractionMutation,
  };
};
