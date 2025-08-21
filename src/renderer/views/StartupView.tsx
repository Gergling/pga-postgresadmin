import { useCallback, useEffect } from "react";
import { Status } from "../libs/status/StatusComponent";
import { useDocker } from "../libs/docker/use-docker-store";
import { useIpc } from "../shared/ipc/hook";
import { DOCKER_PULL_POSTGRES_CHANNEL_DONE, DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS } from "../../shared/docker-postgres/types";
import { useStatus } from "../libs/status/use-status-store";
import { EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED } from "../../ipc";

export const StartupView = () => {
  const { check, checking, message, running, image } = useDocker();
  const { checkDockerStatus, checkDockerImage, on, pullPostgresImage } = useIpc();
  const { clearStatuses, statuses, update } = useStatus();

  const recheck = useCallback(() => {
    check(checkDockerStatus, checkDockerImage);
  }, [clearStatuses, check, checkDockerStatus]);

  useEffect(() => {
    const removeListener = on(EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED, recheck);

    recheck();

    return () => {
      removeListener();
    };
  }, [on, recheck]);

  useEffect(() => {
    const removers = [
      on(DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS, ({ args }) => {
        update({
          name: 'image',
          description: 'No docker postgres image found. Pulling...' + args.join(', '),
          status: 'pending',
        });
      }),
      on(DOCKER_PULL_POSTGRES_CHANNEL_DONE, (args) => {
        console.log('done', args)
        update({
          name: 'image',
          description: 'Image downloaded',
          status: 'success',
        });
      }),
    ];

    return () => {
      removers.forEach((removeListener) => removeListener());
    };
  }, [on]);

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
          description: 'No docker postgres image found. Attempting to pull image.',
          status: 'failure',
        });

        pullPostgresImage();
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
