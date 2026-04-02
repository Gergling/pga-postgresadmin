import { useMutation, useQuery } from "@tanstack/react-query";
import { hydrateJobSearchInteraction, JobSearchDbSchema } from "../../../../shared/features/job-search";
import { getCollectionKey, useQueryDataFactory } from "../../../libs/react-query";
import { useIpc } from "../../../shared/ipc";

type Interaction = JobSearchDbSchema['base']['interactions'];
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

export const useJobSearchInteractionsIpc = (interactionId?: JobSearchDbSchema['id']['interactions']) => {
  const { fetchRecentInteractions, fetchInteraction, updateInteraction } = useIpc();
  const setQueryData = useQueryData();

  const create = useJobSearchInteractionIpcCreate();

  // Read
  const {
    data: interactions,
    isLoading: fetchActiveInteractionsIsLoading,
    isError: fetchActiveInteractionsIsError,
    error: fetchActiveInteractionsError,
  } = useQuery({
    queryKey: getCollectionKey('interactions'),
    queryFn: fetchRecentInteractions,
    select: (models) => new Map(models.map((model) => [model.id, model])),
  });
  const {
    data: interaction,
    isLoading: fetchInteractionIsLoading,
    isError: fetchInteractionIsError,
    error: fetchInteractionError,
  } = useQuery({
    enabled: !!interactionId,
    queryKey: getCollectionKey('interactions', interactionId),
    queryFn: () => interactionId ? fetchInteraction(interactionId) : undefined,
    select: (model) => model || undefined,
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
    ...create,
    interactions,
    interaction,
    fetchInteractionError,
    fetchInteractionIsError,
    fetchInteractionIsLoading,
    fetchActiveInteractionsError,
    fetchActiveInteractionsIsError,
    fetchActiveInteractionsIsLoading,
    updateInteractionError,
    updateInteractionIsError,
    updateInteraction: updateInteractionMutation,
  };
};
