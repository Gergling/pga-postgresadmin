export const ORCHESTRATOR_COMMANDS = [
  "generate-commit-message",
  "generate-unit-test",
] as const;

export type OrchestratorCommand = typeof ORCHESTRATOR_COMMANDS[number];
