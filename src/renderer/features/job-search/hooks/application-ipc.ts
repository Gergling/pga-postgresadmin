import { useMutation, useQuery } from "@tanstack/react-query";
import { useIpc } from "../../../shared/ipc";
import { getCollectionKeyFactory, useQueryDataFactory } from "../../../libs/react-query";
import {
  JobSearchApplicationTransfer,
  JobSearchDbSchema
} from "@shared/features/job-search";
// import { useJobSearchApplicationsIpcCreate } from "./application-ipc-create";

// TODO: Employments absolutely needs to update the cache for the other two collections
const getCollectionKey = getCollectionKeyFactory<JobSearchDbSchema>();

// const useQueryData = () => useQueryDataFactory<Application>('applications');

// TODO: Centralise this.
// const useQueryDataInteractions = () => useQueryDataFactory<JobSearchDbSchema['base']['interactions']>('interactions');

// const useJobSearchApplicationsIpcCreate = () => {
//   const { createApplication: createApplicationIpc } = useIpc();
//   const setQueryData = useQueryData();
//   const setQueryDataInteractions = useQueryDataInteractions();

//   const {
//     mutate: createApplicationMutate,
//     isError: createApplicationIsError,
//     error: createApplicationError,
//   } = useMutation({
//     mutationFn: ({ payload: { applications, interaction } }: {
//       payload: {
//         applications: CreateApplicationPayload[];
//         interaction: JobSearchDbSchema['base']['interactions'];
//       };
//       onSuccess?: (data: Application) => void;
//     }) => {
//       const hydratedApplications = applications.map(hydrateJobSearchApplication);
//       return createApplicationIpc(hydratedApplications, interaction);
//     },
//     onSuccess: (payload, variables) => {
//       const { applications, interaction } = payload;
//       applications.forEach((application) => {
//         setQueryData(application);
//       });
//       setQueryDataInteractions(interaction);
//       if (variables.onSuccess) variables.onSuccess(payload);
//     },
//   });
//   const createApplication = (
//     applications: CreateApplicationPayload[],
//     interaction: JobSearchDbSchema['base']['interactions'],
//     onSuccess?: (application: Application) => void,
//   ) => {
//     createApplicationMutate({ payload: { applications, interaction }, onSuccess });
//   };

//   return {
//     createApplication,
//     createApplicationError,
//     createApplicationIsError,
//   };
// };

export const useJobSearchApplicationsIpc = (applicationId?: JobSearchDbSchema['id']['applications']) => {
  const { fetchActiveApplications, fetchApplication, updateApplication } = useIpc();
  const setQueryData = useQueryDataFactory<JobSearchApplicationTransfer>('applications');

  // const create = useJobSearchApplicationsIpcCreate();

  // Read
  const {
    data: applications,
    isLoading: fetchActiveApplicationsIsLoading,
    isError: fetchActiveApplicationsIsError,
    error: fetchActiveApplicationsError,
  } = useQuery({
    queryKey: getCollectionKey('applications'),
    queryFn: () => fetchActiveApplications(),
    select: (models) => new Map(models.map((model) => [model.id, model])),
  });
  const {
    data: application,
    isLoading: fetchApplicationIsLoading,
    isError: fetchApplicationIsError,
    error: fetchApplicationError,
  } = useQuery({
    enabled: !!applicationId,
    queryKey: getCollectionKey('applications', applicationId),
    queryFn: () => applicationId ? fetchApplication(applicationId) : undefined,
    select: (model) => model || undefined,
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
    // ...create,
    applications,
    application,
    fetchActiveApplicationsError,
    fetchActiveApplicationsIsError,
    fetchActiveApplicationsIsLoading,
    fetchApplicationError,
    fetchApplicationIsError,
    fetchApplicationIsLoading,
    updateApplicationError,
    updateApplicationIsError,
    updateApplication: updateApplicationMutation,
  };
};
