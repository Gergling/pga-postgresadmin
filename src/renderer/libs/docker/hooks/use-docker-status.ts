import { useCallback, useEffect, useMemo } from "react";
import { UncertainBoolean } from "../../../../shared/types";
import { StatusItemProps, useStatus } from "../../status";
import { useDocker } from "./use-docker";
import { DockerPostgresPhase } from "./use-docker-store";

type PhaseStatusMapping = {
  [K in UncertainBoolean]: StatusItemProps['status'];
};

const phaseStatusMapping: PhaseStatusMapping = {
  no: 'failure',
  unknown: 'pending',
  yes: 'success',
};

type ChecklistStatusConfig = {
  [P in DockerPostgresPhase]: {
    [S in StatusItemProps['status']]: string;
  };
};

export const useDockerStatus = () => {
  const { imageLayers, isCompleted, message, reset, runChecklist, statusView } = useDocker();
  const { clearStatuses, statuses, update } = useStatus();

  const statusConfig = useMemo((): ChecklistStatusConfig => ({
    engine: {
      failure: 'Docker is not running: ' + message,
      pending: 'Checking Docker status',
      success: 'Docker is running',
    },
    image: {
      failure: 'No docker postgres image found. Attempting to pull image.',
      pending: 'Checking docker postgres image...' + imageLayers.join(', '),
      success: 'Image exists',
    },
    container: {
      failure: 'Container is not running',
      pending: 'Checking if container is running...',
      success: 'Container is running',
    },
  }), [imageLayers, message]);

  const statusUpdates = useMemo(() => statusView.map(({
    phase,
    status,
  }): StatusItemProps => {
    const phaseStatus = phaseStatusMapping[status];
    const description = statusConfig[phase][phaseStatus];
    return {
      name: phase,
      description,
      status: phaseStatus,
    };
  }), [statusView, statusConfig]);

  const recheck = useCallback(() => {
    reset();
    clearStatuses();
    runChecklist();
  }, [clearStatuses, reset, runChecklist]);

  useEffect(() => {
    statusUpdates.forEach(update);
  }, [statusUpdates, update]);

  return {
    isCompleted,
    recheck,
    statuses,
  }
};
