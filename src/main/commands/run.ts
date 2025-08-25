import { exec } from 'child_process';
import { CommandStatusResponse } from "../../shared/types";

export const runCommand = (
  command: string,
): Promise<CommandStatusResponse> => {
  console.log('Running command:', command);
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
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
