import { useEffect, useMemo } from "react";
import { useIpc } from "../../shared/ipc/hook";
import { DockerPostgresPhase, useDockerStore } from "./use-docker-store";
import { DOCKER_PULL_POSTGRES_CHANNEL_DONE, DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS } from "../../../shared/docker-postgres/types";
import { UncertainBoolean } from "../../../shared/types";

type StatusViewItem = {
  phase: DockerPostgresPhase;
  status: UncertainBoolean;
};

const statusViewOrder: DockerPostgresPhase[] = ['engine', 'image', 'container'];

export const useDocker = () => {
  const {
    initialise,
    imageLayers,
    message,
    phase: { breakdown, current },
    reset,
    runChecklist,
    updatePullProgress,
    updatePullStatus
  } = useDockerStore();
  const {
    checkDockerContainer,
    checkDockerImage,
    checkDockerStatus,
    on,
    pullPostgresImage,
    runDockerContainer,
  } = useIpc();

  const statusView = useMemo(() => {
    return statusViewOrder.reduce(
      (
        statuses,
        phase
      ) => {
        const isCurrentPhase = phase === current;
        const status = breakdown[phase];

        if (!isCurrentPhase && status === 'unknown') return statuses;

        return [...statuses, { phase, status }];
      },
      [] as StatusViewItem[]
    );
  }, [breakdown, current]);

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
        image: pullPostgresImage,
        container: runDockerContainer,
      },
      {
        engine: checkDockerStatus,
        image: checkDockerImage,
        container: checkDockerContainer,
      }
    );

    return () => {
      removers.forEach((removeListener) => removeListener());
    };
  }, []);

  return {
    imageLayers,
    message,
    reset,
    runChecklist,
    statusView,
  }
};
