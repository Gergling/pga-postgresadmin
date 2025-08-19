import { exec } from 'child_process';
import { DockerCommands, DockerStatus } from './types';

export const runDockerInfo = (): Promise<DockerStatus> => {
  return new Promise((resolve) => {
    // The 'docker info' command will fail if Docker isn't running or installed.
    exec('docker info', (error, stdout, stderr) => {
      if (error) {
        // An error here means the command failed, so Docker is not running.
        resolve({ status: 'inactive', message: error.message + '+++SEPARATOR+++' + stderr });
      } else {
        // If there's no error, Docker is running.
        resolve({ status: 'running' });
      }
    });
  });
}

export const getCommands = (): DockerCommands => ({ runDockerInfo });
