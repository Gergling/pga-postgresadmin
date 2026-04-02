// TODO: Technically we don't create "applications", just interactions that
// happen to create or update applications.

import { Mandatory } from "../../../../shared/types";
import { hydrateJobSearchApplication, JobSearchDbSchema } from "../../../../shared/features/job-search";
import { useIpc } from "../../../shared/ipc";
import { useJobSearchApplicationQueryData, useJobSearchInteractionQueryData } from "./query-data";
import { useMutation } from "@tanstack/react-query";

type Application = JobSearchDbSchema['base']['applications'];
type Interaction = JobSearchDbSchema['base']['interactions'];
type CreateApplicationPayload = Mandatory<Application, 'phase' | 'role' | 'sourceType'>;

type OnMutationSuccessFunction = (interaction: Interaction) => void;

export const useJobSearchApplicationsIpcCreate = () => {
  const { createApplication: createApplicationIpc } = useIpc();
  const setQueryDataApplication = useJobSearchApplicationQueryData();
  const setQueryDataInteraction = useJobSearchInteractionQueryData();

  const {
    mutate: createApplicationMutate,
    isError: createApplicationIsError,
    error: createApplicationError,
    isPending: createApplicationIsPending,
  } = useMutation({
    mutationFn: ({ payload: { applications, interaction } }: {
      payload: {
        applications: CreateApplicationPayload[];
        interaction: Omit<Interaction, 'id'>;
      };
      onSuccess?: OnMutationSuccessFunction;
    }) => {
      const hydratedApplications = applications.map(hydrateJobSearchApplication);
      return createApplicationIpc(hydratedApplications, interaction);
    },
    onSuccess: ({ applications, interaction }, variables) => {
      applications.forEach((application) => {
        setQueryDataApplication(application);
      });
      setQueryDataInteraction(interaction);
      if (variables.onSuccess) variables.onSuccess(interaction);
    },
  });
  const createApplication = (
    applications: CreateApplicationPayload[],
    interaction: Omit<Interaction, 'id'>,
    onSuccess?: OnMutationSuccessFunction,
  ) => {
    createApplicationMutate({ payload: { applications, interaction }, onSuccess });
  };

  return {
    createApplication,
    createApplicationError,
    createApplicationIsError,
    createApplicationIsPending,
  };
};
