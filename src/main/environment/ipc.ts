import { ManageEnvironment } from "./types";
import { getEnvironment, setEnvironment } from '../shared/environment/utilities';
import { log } from "../shared/logging";
import { getVessel } from "../shared/vessel";
import { initializeFirebase } from "../libs/firebase";

export const manageEnvironment = (): ManageEnvironment => ({
  get: async () => getEnvironment(),
  set: async (env) => {
    setEnvironment(env)
    log(`Environment set to ${env}.`, 'success');
    log(`Reloading...`, 'info');
    initializeFirebase();
    getVessel()?.reload();
    return {
      success: true,
      data: env
    };
  },
});
