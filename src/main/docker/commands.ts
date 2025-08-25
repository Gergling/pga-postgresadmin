import { spawn } from 'child_process';
import { DockerCommands, DockerStatus } from './types';
import { DOCKER_PULL_POSTGRES_CHANNEL_DONE, DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS } from '../../shared/docker-postgres/types';
import { runCommand } from '../commands/run';
import { DOCKER_CONTAINER_NAME } from './constants';

export const runDockerInfo = (): Promise<DockerStatus> => runCommand('docker info');

export const runDockerImageInspect = (): Promise<DockerStatus> => runCommand('docker image inspect postgres');

// TODO: This is going to be format of the main thread part of an abstract command-running framework.
export const runDockerPullPostgres = (
  event: Electron.IpcMainInvokeEvent
): void => {
  const child = spawn('docker', ['pull', 'postgres']);

  // Send progress to the renderer
  child.stdout.on('data', (data) => {
    event.sender.send(DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS, data.toString());
  });

  // Send a completion message
  child.on('close', (code) => {
    event.sender.send(DOCKER_PULL_POSTGRES_CHANNEL_DONE, { success: code === 0 });
  });

  // Handle any errors
  child.on('error', (err) => {
    event.sender.send(DOCKER_PULL_POSTGRES_CHANNEL_DONE, { success: false, error: err.message });
  });
}

export const runDockerPSPostgres = async (): Promise<DockerStatus> => {
  const {
    error,
    status,
    stderr,
    stdout,
  } = await runCommand(`docker ps -a --filter "name=${DOCKER_CONTAINER_NAME}" --format "{{.Names}}: {{.Status}}"`);

  if (status && stdout) {
    // If the command was successful, and there's output, check if the container is running.
    const isRunning = stdout.includes(DOCKER_CONTAINER_NAME) && !stdout.includes('Exited');
    return {
      status: isRunning,
      stdout,
    };
  }

  // If the command failed or there's no output, return the error status.
  return {
    status: false,
    error,
    stderr,
    stdout,
  };
};

export const runDockerRunPostgres = async (): Promise<DockerStatus> => {
  return runCommand(`docker run --name ${DOCKER_CONTAINER_NAME} -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres`);
};

export const getCommands = (): DockerCommands => ({
  runDockerInfo,
  runDockerImageInspect,
  runDockerPSPostgres,
  runDockerPullPostgres,
  runDockerRunPostgres,
});
