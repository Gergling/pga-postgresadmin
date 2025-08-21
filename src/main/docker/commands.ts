import { exec } from 'child_process';
import { DockerCommands, DockerStatus } from './types';

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

export const getCommands = (): DockerCommands => ({ runDockerInfo, runDockerImageInspect });
