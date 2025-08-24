import { exec, spawn } from 'child_process';
import { DockerCommands, DockerStatus } from './types';
import { DOCKER_PULL_POSTGRES_CHANNEL_DONE, DOCKER_PULL_POSTGRES_CHANNEL_PROGRESS } from '../../shared/docker-postgres/types';

// TODO: Definitely a DRYing candidate.
export const runDockerInfo = (): Promise<DockerStatus> => {
  return new Promise((resolve) => {
    // The 'docker info' command will fail if Docker isn't running or installed.
    exec('docker info', (error, stdout, stderr) => {
      if (error) {
        // An error here means the command failed, so Docker is not running.
        resolve({
          status: false,
          error: error.message,
          stderr,
        });
      } else {
        // If there's no error, Docker is running.
        resolve({
          status: true,
          stdout,
        });
      }
    });
  });
}

export const runDockerImageInspect = (): Promise<DockerStatus> => {
  return new Promise((resolve) => {
    // The 'docker info' command will fail if Docker isn't running or installed.
    exec('docker image inspect postgres', (error, stdout, stderr) => {
      if (error) {
        // An error here means the command failed, so Docker is not running.
        resolve({
          status: false,
          error: error.message,
          stderr,
        });
      } else {
        // If there's no error, Docker is running.
        resolve({
          status: true,
          stdout,
        });
      }
    });
  });
}

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

export const runDockerPSPostgres = (): Promise<DockerStatus> => {
  return new Promise((resolve) => {
    exec('docker ps -a --filter "name=your-postgres-db" | grep .', (error, stdout, stderr) => {
      if (error) {
        resolve({
          status: false,
          error: error.message,
          stderr,
        });
      } else {
        resolve({
          status: true,
          stdout,
        });
      }
    });
  });
}

export const getCommands = (): DockerCommands => ({
  runDockerInfo,
  runDockerImageInspect,
  runDockerPSPostgres,
  runDockerPullPostgres,
});
