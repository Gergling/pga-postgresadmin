import { useCallback, useEffect } from "react";
import { Status } from "../libs/status/StatusComponent";
import { useDocker } from "../libs/docker/use-docker-store";
import { useIpc } from "../shared/ipc/hook";
import { useStatus } from "../libs/status/use-status-store";
import { WINDOW_EVENTS_FOCUSED } from "../../libs/ipc";

export const StartupView = () => {
  const { check, checking, message, running, image } = useDocker();
  const { checkDockerStatus, checkDockerImage, on } = useIpc();
  const { clearStatuses, statuses, update } = useStatus();

  const recheck = useCallback(() => {
    check(checkDockerStatus, checkDockerImage);
  }, [clearStatuses, check, checkDockerStatus]);

  useEffect(() => {
    const removeListener = on(WINDOW_EVENTS_FOCUSED, recheck);

    recheck();

    return () => {
      removeListener();
    };
  }, [on, recheck]);

  // TODO: Needs a special amount of DRYing up.
  useEffect(() => {
    clearStatuses();
    if (running === 'yes') {
      update({
        name: 'docker',
        description: 'Docker is running',
        status: 'success',
      });
    }
    if (running === 'unknown') {
      update({
        name: 'docker',
        description: 'Checking Docker status',
        status: 'pending',
      });
    }
    if (running === 'no') {
      update({
        name: 'docker',
        description: 'Docker is not running: ' + message,
        status: 'failure',
      });
    }
  }, [running, update]);
  useEffect(() => {
    if (running === 'yes') {
      if (image === 'yes') {
        update({
          name: 'image',
          description: 'Image exists',
          status: 'success',
        });
      }
      if (image === 'unknown') {
        update({
          name: 'image',
          description: 'Checking docker postgres image...',
          status: 'pending',
        });
      }
      if (image === 'no') {
        update({
          name: 'image',
          description: 'No docker postgres image found.',
          status: 'failure',
        });
      }
    }
  }, [image, running, update]);
  return (
    <>
      <h2>Startup Status</h2>
      <div>Checking: {checking ? 'checking' : 'not checking'}</div>
      <div>Running: {running}</div>
      <div>Image: {image}</div>
      <Status statuses={statuses} />
    </>
  );
};
