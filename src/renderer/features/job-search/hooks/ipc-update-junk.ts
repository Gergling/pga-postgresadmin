import { useMutation } from "@tanstack/react-query";
import { JobSearchApplicationTransfer, JobSearchInteractionTransfer, JobSearchUpdateTransfer } from "@shared/features/job-search";
import { useIpc } from "@/renderer/shared/ipc";
import { useIpcCreateFactory, useQueryDataFactory } from "@/renderer/libs/react-query";
import { jobSearchUpdateFormToCreation } from "../utilities";
import { JobSearchUpdateForm } from "../types";

export const useJobSearchIpcUpdate = () => {
  const setApplicationQueryData = useQueryDataFactory<
    JobSearchApplicationTransfer
  >('applications');
  const setInteractionQueryData = useQueryDataFactory<
    JobSearchInteractionTransfer
  >('interactions');
  const {
    createInteraction: createInteractionIpc,
    updateApplication,
  } = useIpc();

  // useIpcCreateFactory(
  //   createInteractionIpc,
  //   'interactions',
  //   jobSearchUpdateFormToCreation,
  // );
  const {
    mutate: createInteractionMutation,
    isError: createIsError,
    error: createError,
    isPending: createIsPending,
  } = useMutation({
    mutationFn: ({ payload }: {
      payload: JobSearchUpdateForm;
      onSuccess?: (data: JobSearchUpdateTransfer) => void;
    }) => createInteractionIpc(jobSearchUpdateFormToCreation(payload)),
    onSuccess: (createdData, variables) => {
      const { applications, interaction } = createdData;
      applications.forEach((application) => {
        setApplicationQueryData(application);
      });
      setInteractionQueryData(interaction);
      if (variables.onSuccess) variables.onSuccess(createdData);
    },
  });
  const create = (
    payload: JobSearchUpdateForm,
    onSuccess?: OnSuccessFnc,
  ) => {
    createInteractionMutation({ payload, onSuccess });
  };

  const {
    mutate: updateApplicationMutation,
    isError: updateApplicationIsError,
    error: updateApplicationError,
  } = useMutation({
    mutationFn: updateApplication,
    onSuccess: setQueryData,
  });
};
