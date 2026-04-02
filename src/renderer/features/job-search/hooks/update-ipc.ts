import { useIpcCreateFactory, useQueryDataFactory } from "@/renderer/libs/react-query";
import { useIpc } from "@/renderer/shared/ipc";
import { JobSearchApplicationTransfer, JobSearchInteractionTransfer, JobSearchUpdateTransfer } from "@shared/features/job-search";
import { useMutation } from "@tanstack/react-query";
import { JobSearchUpdateForm } from "../types";
import { jobSearchUpdateFormToCreation } from "../utilities";

type OnSuccessFnc = (data: JobSearchUpdateTransfer) => void;

/**
 * Due to the complex nature of the job search update form, and its
 * relationship to the IPC, it has its own hook.
 */
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
    }) => {
      console.log('mutating...', payload)
      return createInteractionIpc(jobSearchUpdateFormToCreation(payload));
    },
    onSuccess: (createdData, variables) => {
      const { applications, interaction } = createdData;
      applications.forEach((application) => {
        setApplicationQueryData(application);
      });
      setInteractionQueryData(interaction);
      if (variables.onSuccess) variables.onSuccess(createdData);
    },
  });
  useIpcCreateFactory(
    createApplicationIpc,
    'applications',
    jobSearchUpdateFormToCreation,
  );
  // const {
  //   mutate: updateApplicationMutation,
  //   isError: updateApplicationIsError,
  //   error: updateApplicationError,
  // } = useMutation({
  //   mutationFn: updateApplication,
  //   onSuccess: setApplicationQueryData,
  // });

  const create = (
    payload: JobSearchUpdateForm,
    onSuccess?: OnSuccessFnc,
  ) => {
    console.log('creating...', payload)
    createInteractionMutation({ payload, onSuccess });
  };

  return {
    create,
    createError,
    createIsError,
    createIsPending,
  };
};
