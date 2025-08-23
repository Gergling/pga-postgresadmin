import { useEffect } from "react";
import { useIpc } from "../../shared/ipc/hook";
import { useDockerStore } from "./use-docker-store";
import { DOCKER_PULL_POSTGRES_CHANNEL_DONE, DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS } from "../../../shared/docker-postgres/types";

export const useDocker = () => {
  const { checking, initialise, imageLayers, message, phase, reset, runChecklist, updatePullProgress, updatePullStatus } = useDockerStore();
  const { checkDockerStatus, on, pullPostgresImage } = useIpc();

  useEffect(() => {
    const removers = [
      // TODO: Consider separate invocation functions for
      // dockerPullPostgresSubscriptions.
      // This would require a modification to the structure where the
      // invocation and handler are separate.
      on(DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS, ({ args }) => {
        updatePullProgress(args.join(', '));
      }),
      on(DOCKER_PULL_POSTGRES_CHANNEL_DONE, ({
        args: [{ success, error }]
      }: {
        // TODO: I hate it.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args: any[];
      }) => {
        const message = success ? 'Image downloaded' : error;
        const status = success ? 'yes' : 'no';
        updatePullStatus(status, message);
      }),
    ];

    initialise(
      {
        image: pullPostgresImage
      },
      {
        engine: checkDockerStatus,
        container: () => Promise.resolve({ status: false })
      }
    );

    return () => {
      removers.forEach((removeListener) => removeListener());
    };
  }, []);

  return {
    runChecklist,
    checking,
    imageLayers,
    message,
    phase,
    reset,
  }
};
