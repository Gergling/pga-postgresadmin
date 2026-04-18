import { GetEnvironment, SetEnvironment } from "../shared/settings";

export type ManageEnvironment = {
  get: () => Promise<ReturnType<GetEnvironment>>;
  set: SetEnvironment;
};
