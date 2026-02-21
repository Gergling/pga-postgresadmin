import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Mandatory } from "../../../../shared/types";
import { CrmArchetype } from "../../../../shared/features/crm";
import { useIpc } from "../../../shared/ipc";
import { useQueryDataFactory } from "../../../libs/react-query/hooks";

// TODO: Employments absolutely needs to update the cache for the other two collections
const getCollectionKey = <T extends CrmArchetype['collectionName']>(collectionName: T, id?: CrmArchetype['id'][T]) => {
  if (id === undefined) return [collectionName];
  return [collectionName, id];
};

export const useCrmPeople = () => {
  // Fetch people and companies (most recent and by search).
  // Create new people and companies.
  // Update people and companies.
  const { createPerson: createPersonIpc, fetchRecentPeople, updatePerson } = useIpc();
  const setQueryData = useQueryDataFactory<CrmArchetype['base']['people']>('people');
  const createPerson = useCallback(
    (newPerson: Mandatory<CrmArchetype['modelType']['people'], 'name'>) => createPersonIpc({
      ...newPerson,
      contactId: {},
    }),
    [createPersonIpc]
  );
  const {
    data: people,
    isLoading: fetchRecentPeopleIsLoading,
    isError: fetchRecentPeopleIsError,
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
    onSuccess: setQueryData,
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
    createPerson: createPersonMutation,
    fetchRecentPeopleError,
    fetchRecentPeopleIsError,
    fetchRecentPeopleIsLoading,
    people,
    updatePersonError,
    updatePersonIsError,
    updatePerson: updatePersonMutation,
  };
};
