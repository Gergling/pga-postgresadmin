import { MutationResponse } from "../../shared/types";

export type EnvironmentProps = 'dev' | 'prod';
export type GetEnvironment = () => Promise<EnvironmentProps>;
export type SetEnvironment = (env: EnvironmentProps) => Promise<MutationResponse<EnvironmentProps>>;
export type ManageEnvironment = {
  get: GetEnvironment;
  set: SetEnvironment;
};
