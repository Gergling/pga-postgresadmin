import { useCallback, useEffect } from "react";
import { Status } from "../libs/status/StatusComponent";
import { useDocker } from "../libs/docker/use-docker-store";
import { useIpc } from "../shared/ipc/hook";
import { useStatus } from "../libs/status/use-status-store";

export const StartupView = () => {
  const { check, checking, message, status } = useDocker();
  const { checkDockerStatus, on } = useIpc();
  const { statuses, update } = useStatus();

  const recheck = useCallback(() => {
    check(checkDockerStatus);
  }, [check, checkDockerStatus]);

  useEffect(() => {
    const removeListener = on('window-focused', recheck);

    recheck();

    return () => {
      removeListener();
    };
  }, [on, recheck]);

  useEffect(() => {
    if (status === 'running') {
      update({
        name: 'docker',
        description: 'Docker is running',
        status: 'success',
      });
    }
    if (status === 'unknown') {
      update({
        name: 'docker',
        description: 'Checking Docker status',
        status: 'pending',
      });
    }
    if (status === 'inactive') {
      update({
        name: 'docker',
        description: 'Docker is not running: ' + message,
        status: 'failure',
      });
    }
  }, [status, update]);
  return (
    <>
      <h2>Startup Status</h2>
      <div>Checking: {checking ? 'checking' : 'not checking'}</div>
      <div>Status: {status}</div>
      <Status statuses={statuses} />
    </>
  );
};