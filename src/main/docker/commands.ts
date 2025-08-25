import { spawn } from 'child_process';
import { DockerCommands, DockerStatus } from './types';
import { DOCKER_PULL_POSTGRES_CHANNEL_DONE, DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS } from '../../shared/docker-postgres/types';
import { runCommand } from '../commands/run';

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
  const containerName = 'postgres-db';
  const {
    error,
    status,
    stderr,
    stdout,
  } = await runCommand(`docker ps -a --filter "name=${containerName}"`);

  if (status && stdout) {
    // If the command was successful, and there's output, check if the container is running.
    const isRunning = stdout.includes(containerName) && !stdout.includes('Exited');
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

export const getCommands = (): DockerCommands => ({
  runDockerInfo,
  runDockerImageInspect,
  runDockerPSPostgres,
  runDockerPullPostgres,
});
