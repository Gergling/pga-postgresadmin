import { useCallback, useEffect, useMemo } from "react";
import { UncertainBoolean } from "../../../../shared/types";
import { StatusItemProps, useStatus } from "../../status";
import { DockerChecklistName } from "../../../../shared/docker-postgres/types";
import { useDockerStore } from "./use-docker-store";

type PhaseStatusMapping = {
  [K in UncertainBoolean]: StatusItemProps['status'];
};

const phaseStatusMapping: PhaseStatusMapping = {
  no: 'failure',
  unknown: 'pending',
  yes: 'success',
};

type ChecklistStatusConfig = {
  [P in DockerChecklistName]: {
    [S in StatusItemProps['status']]: string;
  }; // Include what is needed to proceed, e.g. server details
};

const statusConfig: ChecklistStatusConfig = {
  engine: {
    failure: 'Docker is not running.',
    pending: 'Checking Docker status...',
    success: 'Docker is running',
  },
  'container-exists': {
    failure: 'Container does not exist. Attempt to create container.',
    pending: 'Checking if container exists...',
    success: 'Container exists',
  },
  image: {
    failure: 'No docker postgres image found. Attempting to pull image.',
    pending: 'Checking docker postgres image...',
    success: 'Image exists',
  },
  'container-running': {
    failure: 'Container is not running',
    pending: 'Checking if container is running...',
    success: 'Container is running',
  },
};

export const useDockerStatus = () => {
  const {
    checklist,
    rerun,
  } = useDockerStore();
  const { clearStatuses, statuses, update } = useStatus();

  const statusUpdates = useMemo(() => checklist.map(({
    // description, // TODO: ...
    name,
    status,
  }): StatusItemProps => {
    const phaseStatus = phaseStatusMapping[status];
    const label = statusConfig[name][phaseStatus];
    return {
      name,
      description: label,
      status: phaseStatus,
    };
  }), [checklist, statusConfig]);

  const recheck = useCallback(() => {
    clearStatuses();
    rerun();
  }, [clearStatuses, rerun]);

  useEffect(() => {
    statusUpdates.forEach(update);
  }, [statusUpdates, update]);

  return {
    recheck,
    statuses,
  }
};
