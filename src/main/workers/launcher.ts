import path from "path";
import { utilityProcess } from "electron/main";
import { ETLPayload } from "@/workers";

export const runWorkerTask = (payload: ETLPayload): Promise<string> => {
  return new Promise((resolve, reject) => {
    // TODO: I'm 90% certain this won't work because it will need to find the
    // correct bundled file.
    const child = utilityProcess.fork(path.join(__dirname, '../../workers/etl.js'));
    
    child.postMessage(payload);

    child.on('message', (response) => {
      // TODO: Might wanna zod this since it's coming through as any. Good
      // .parse() opportunity.
      console.log('on message via worker launcher', response)
      if (response.status === 'SUCCESS') resolve(response.result!);
      else reject(response.error);
    });

    child.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
    });
  });
}
