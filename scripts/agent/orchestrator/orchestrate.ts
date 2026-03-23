import { OrchestratorCommand } from "./config";
import { commitStagedCode, createUnitTestFile } from "./operations";

export const orchestrate = (cmd: OrchestratorCommand | null) => {
  if (!cmd) return;

  switch (cmd) {
    case 'generate-commit-message':
      commitStagedCode();
      break;
    case 'generate-unit-test':
      createUnitTestFile();
      break;
    default:
      throw new Error(`Unknown command: ${cmd}`);
  }
};
