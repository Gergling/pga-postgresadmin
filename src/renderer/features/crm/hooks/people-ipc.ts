import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CrmPersonTransfer,
  CrmSchema,
  hydrateCrmPerson
} from "@shared/features/crm";
import { useIpc } from "@/renderer/shared/ipc";
import {
  getCollectionKeyFactory,
  useIpcCreateFactory,
  useQueryDataFactory
} from "@/renderer/libs/react-query";

const getCollectionKey = getCollectionKeyFactory<CrmSchema>();

export const useCrmPeopleIpc = (personId?: CrmSchema['id']['people']) => {
  // Fetch people and companies (most recent and by search).
  // Create new people and companies.
  // Update people and companies.
  const {
    createPerson: createPersonIpc,
    fetchPerson,
    fetchRecentPeople,
    updatePerson
  } = useIpc();
  const setQueryData = useQueryDataFactory<CrmPersonTransfer>('people');

  const {
    create: createPerson,
    createError: createPersonError,
    createIsError: createPersonIsError,
  } = useIpcCreateFactory(
    createPersonIpc,
    'people',
    hydrateCrmPerson,
  );

  const {
    data: people,
    isLoading: fetchRecentPeopleIsLoading,
    isError: fetchRecentPeopleIsError,
    error: fetchRecentPeopleError,
  } = useQuery({
    queryKey: getCollectionKey('people'), // Will need to manage cache when a person is created.
    queryFn: () => fetchRecentPeople(),
  });
  const {
    data: person,
    isLoading: fetchPersonIsLoading,
    isError: fetchPersonIsError,
    error: fetchPersonError,
  } = useQuery({
    enabled: !!personId,
    queryKey: getCollectionKey('people', personId),
    queryFn: () => personId ? fetchPerson(personId) : undefined,
    select: (model) => model || undefined,
  });

  const {
    mutate: updatePersonMutation,
    isError: updatePersonIsError,
    error: updatePersonError,
  } = useMutation({
    mutationFn: updatePerson,
    onSuccess: setQueryData,
  });

  return {
    createPersonError,
    createPersonIsError,
    createPerson,
    fetchPersonError,
    fetchPersonIsError,
    fetchPersonIsLoading,
    fetchRecentPeopleError,
    fetchRecentPeopleIsError,
    fetchRecentPeopleIsLoading,
    people,
    person,
    updatePersonError,
    updatePersonIsError,
    updatePerson: updatePersonMutation,
  };
};
