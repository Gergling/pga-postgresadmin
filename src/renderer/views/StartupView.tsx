import { useEffect } from "react";
import { Status } from "../libs/status/StatusComponent";
import { useDocker } from "../libs/docker/use-docker-store";
import { useIpc } from "../shared/ipc/hook";
import { useStatus } from "../libs/status/use-status-store";

export const StartupView = () => {
  const { check, checking, status } = useDocker();
  const { checkDockerStatus } = useIpc();
  const { statuses, update } = useStatus();

  useEffect(() => {
    check(checkDockerStatus);
  }, [check, checkDockerStatus]);

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
        description: 'Docker is not running',
        status: 'failure',
      });
    }
    if (status === 'absent') {
      update({
        name: 'docker',
        description: 'Docker is not installed',
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