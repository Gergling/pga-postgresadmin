import { OrchestratorCommand } from "./config";

export type OrchestratorAgentDomain =
  | 'commit-messages'
  | 'unit-tests'
;

export type OrchestratorArgs = {
  dryRun: boolean;
  hasArgs: boolean;
  isValidOperation: boolean;
  operation: OrchestratorCommand | null;
};
