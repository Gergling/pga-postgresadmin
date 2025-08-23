import { useCallback, useEffect } from "react";
import { Status } from "../libs/status/StatusComponent";
import { useIpc } from "../shared/ipc/hook";
import { useStatus } from "../libs/status/use-status-store";
import { EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED } from "../../ipc";
import { useDocker } from "../libs/docker/use-docker";

export const StartupView = () => {
  const { checking, imageLayers, message, phase, reset, runChecklist } = useDocker();
  const { on } = useIpc();
  const { clearStatuses, statuses, update } = useStatus();

  const recheck = useCallback(() => {
    reset();
    clearStatuses();
    runChecklist();
  }, [clearStatuses, reset, runChecklist]);

  useEffect(() => {
    const removeListener = on(EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED, recheck);

    recheck();

    return () => {
      removeListener();
    };
  }, [on, recheck]);

  // TODO: Needs a special amount of DRYing up.
  useEffect(() => {
    if (phase.breakdown.engine === 'yes') {
      update({
        name: 'docker',
        description: 'Docker is running',
        status: 'success',
      });
      if (phase.breakdown.image === 'yes') {
        update({
          name: 'image',
          description: 'Image exists',
          status: 'success',
        });
      }
      if (phase.breakdown.image === 'unknown') {
        update({
          name: 'image',
          description: 'Checking docker postgres image...' + imageLayers.join(', '),
          status: 'pending',
        });
      }
      if (phase.breakdown.image === 'no') {
        update({
          name: 'image',
          description: 'No docker postgres image found. Attempting to pull image.',
          status: 'failure',
        });
      }
    }
    if (phase.breakdown.engine === 'unknown') {
      update({
        name: 'docker',
        description: 'Checking Docker status',
        status: 'pending',
      });
    }
    if (phase.breakdown.engine === 'no') {
      update({
        name: 'docker',
        description: 'Docker is not running: ' + message,
        status: 'failure',
      });
    }
  }, [phase, update]);

  return (
    <>
      <h2>Startup Status</h2>
      <div>Checking: {checking ? 'checking' : 'not checking'}</div>
      <Status statuses={statuses} />
    </>
  );
};
