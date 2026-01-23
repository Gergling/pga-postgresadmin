import { ManageEnvironment } from "./types";
import { getEnvironment, setEnvironment } from '../shared/environment/utilities';

export const manageEnvironment = (): ManageEnvironment => ({
  get: async () => getEnvironment(),
  set: setEnvironment,
});
