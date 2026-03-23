import { ORCHESTRATOR_COMMANDS } from "./config";

export const showCommands = () => {
  console.log("Available commands:");
  ORCHESTRATOR_COMMANDS.forEach((cmd) => console.log(`  ${cmd}`));
};
