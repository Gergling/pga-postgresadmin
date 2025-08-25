import { useCallback, useEffect, useMemo } from "react";
import { Status } from "../libs/status/StatusComponent";
import { useIpc } from "../shared/ipc/hook";
import { useStatus } from "../libs/status/use-status-store";
import { EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED } from "../../ipc";
import { DockerPostgresPhase, useDocker } from "../libs/docker";
import { StatusItemProps } from "../libs/status/types";
import { UncertainBoolean } from "../../shared/types";

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
  }
};

const useDockerStatus = () => {
  const { imageLayers, message, reset, runChecklist, statusView } = useDocker();
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
    recheck,
    statuses,
  }
};

export const StartupView = () => {
  const { on } = useIpc();
  const { recheck, statuses } = useDockerStatus();

  useEffect(() => {
    const removeListener = on(EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED, recheck);

    recheck();

    return () => {
      removeListener();
    };
  }, [on, recheck]);

  return (
    <>
      <h2>Startup Status</h2>
      <Status statuses={statuses} />
    </>
  );
};
