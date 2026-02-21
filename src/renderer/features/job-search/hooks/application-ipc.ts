import { useMutation, useQuery } from "@tanstack/react-query";
import { Mandatory } from "../../../../shared/types";
import { hydrateJobSearchApplication, JobSearchArchetype } from "../../../../shared/features/job-search";
import { useIpc } from "../../../shared/ipc";
import { useQueryDataFactory } from "../../../libs/react-query";

type Application = JobSearchArchetype['base']['applications'];
type CreateApplicationPayload = Mandatory<Application, 'phase' | 'role' | 'sourceType'>;

// TODO: Employments absolutely needs to update the cache for the other two collections
const getCollectionKey = <T extends JobSearchArchetype['collectionName']>(collectionName: T, id?: JobSearchArchetype['id'][T]) => {
  if (id === undefined) return [collectionName];
  return [collectionName, id];
};

const useQueryData = () => useQueryDataFactory<Application>('applications');

const useJobSearchApplicationsIpcCreate = () => {
  const { createApplication: createApplicationIpc } = useIpc();
  // const setQueryData = useQueryDataFactory<Application>('applications');
  const setQueryData = useQueryData();

  const {
    mutate: createApplicationMutate,
    isError: createApplicationIsError,
    error: createApplicationError,
  } = useMutation({
    mutationFn: ({ payload }: {
      payload: CreateApplicationPayload;
      onSuccess?: (data: Application) => void;
    }) => createApplicationIpc(hydrateJobSearchApplication(payload)),
    onSuccess: (application, variables) => {
      setQueryData(application);
      if (variables.onSuccess) variables.onSuccess(application);
    },
  });
  const createApplication = (
    newApplication: Mandatory<Application, 'phase' | 'role' | 'sourceType'>,
    onSuccess?: (application: Application) => void,
  ) => {
    createApplicationMutate({ payload: newApplication, onSuccess });
  };

  return {
    createApplication,
    createApplicationError,
    createApplicationIsError,
  };
};

export const useJobSearchApplicationsIpc = () => {
  const { fetchActiveApplications, updateApplication } = useIpc();
  const setQueryData = useQueryDataFactory<Application>('applications');

  const {
    createApplication,
    createApplicationIsError,
    createApplicationError,
  } = useJobSearchApplicationsIpcCreate();

  // Read
  const {
    data: applications,
    isLoading: fetchActiveApplicationsIsLoading,
    isError: fetchActiveApplicationsIsError,
    error: fetchActiveApplicationsError,
  } = useQuery({
    queryKey: getCollectionKey('applications'),
    queryFn: fetchActiveApplications,
    select: (models) => new Map(models.map((model) => [model.id, model])),
  });

  // Update
  const {
    mutate: updateApplicationMutation,
    isError: updateApplicationIsError,
    error: updateApplicationError,
  } = useMutation({
    mutationFn: updateApplication,
    onSuccess: setQueryData,
  });

  return {
    applications,
    createApplication,
    createApplicationError,
    createApplicationIsError,
    fetchActiveApplicationsError,
    fetchActiveApplicationsIsError,
    fetchActiveApplicationsIsLoading,
    updateApplicationError,
    updateApplicationIsError,
    updateApplication: updateApplicationMutation,
  };
};
