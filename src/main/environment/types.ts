import { GetEnvironment, SetEnvironment } from "../shared/environment";

export type ManageEnvironment = {
  get: () => Promise<ReturnType<GetEnvironment>>;
  set: SetEnvironment;
};
