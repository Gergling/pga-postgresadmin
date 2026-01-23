import { MutationResponse } from "../../../shared/types";

export type EnvironmentProps = 'dev' | 'prod';
export type GetEnvironment = () => EnvironmentProps;
export type SetEnvironment = (env: EnvironmentProps) => Promise<MutationResponse<EnvironmentProps>>;
