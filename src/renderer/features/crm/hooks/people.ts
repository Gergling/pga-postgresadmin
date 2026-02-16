import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArchetypeMapEntryDefault } from "../../../../shared/lib/typesaurus";
import { CrmArchetype } from "../../../../shared/features/crm";
import { useIpc } from "../../../shared/ipc";

const queryClient = useQueryClient();

const setQueryDataFactory = <T extends ArchetypeMapEntryDefault['base']>(
  keyBase: string
) => {
  const key = [keyBase];
  return (
    updatedData: T
  ) => {
    queryClient.setQueryData<T>([...key, updatedData.id], updatedData);

    queryClient.setQueryData<T[]>(key, (originalData) => {
      if (!originalData) return [updatedData];
      
      const exists = originalData.find(p => p.id === updatedData.id);
      if (exists) {
        // It was an update
        return originalData.map(p => p.id === updatedData.id ? updatedData : p);
      } else {
        // It was a creation
        return [...originalData, updatedData];
      }
    });
  };
};

// TODO: Employments absolutely needs to update the cache for the other two collections
const getCollectionKey = <T extends CrmArchetype['collectionName']>(collectionName: T, id?: CrmArchetype['id'][T]) => {
  if (id === undefined) return [collectionName];
  return [collectionName, id];
};

export const useCrmPeople = () => {
  // Fetch people and companies (most recent and by search).
  // Create new people and companies.
  // Update people and companies.
  const { createPerson, fetchRecentPeople, updatePerson } = useIpc();
    const {
    data: people,
    isLoading: isLoadingRecentPeople,
    isError: isFetchRecentPeopleError,
    error: fetchRecentPeopleError,
  } = useQuery({
    queryKey: getCollectionKey('people'), // Will need to manage cache when a person is created.
    queryFn: fetchRecentPeople,
  });
  const {
    mutate: createPersonMutation,
    isError: createPersonIsError,
    error: createPersonError,
  } = useMutation({
    mutationFn: createPerson,
    onSuccess: setQueryDataFactory('people'),
  });
  const {
    mutate: updatePersonMutation,
    isError: updatePersonIsError,
    error: updatePersonError,
  } = useMutation({
    mutationFn: updatePerson,
    onSuccess: setQueryDataFactory('people'),
  });
  

  return {
    create: {
      error: createPersonError,
      isError: createPersonIsError,
      mutate: createPersonMutation,
    },
    read: {
      error: fetchRecentPeopleError,
      isError: isFetchRecentPeopleError,
      isLoading: isLoadingRecentPeople,
      people,
    },
    update: {
      error: updatePersonError,
      isError: updatePersonIsError,
      mutate: updatePersonMutation,
    },
  };
};
