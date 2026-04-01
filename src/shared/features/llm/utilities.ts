import { LlmInstruction } from "./types";

export const getLlmInstructions = (
  instructions: LlmInstruction[]
) => instructions.map(i => typeof i === 'string'
  ? i
  : i.instruction
).join('\n\n');
