import { SerialisedModelSummary } from "./schema";
import { LlmInstruction } from "./types";

export const getLlmInstructions = (
  instructions: LlmInstruction[]
) => instructions.map(i => typeof i === 'string'
  ? i
  : i.instruction
).join('\n\n');

export const getOperationCodeFactory = (
  featureName: string
) => (operationName: string) => `${featureName}:${operationName}`;

type ModelEfficiencyParams = Pick<SerialisedModelSummary, 'rate' | 'runtime'>;
export const getModelEfficiency = ({
  rate, runtime: { mean, median }
}: ModelEfficiencyParams): SerialisedModelSummary['efficiency'] => {
  const scaled = rate * 100000;
  return { infrastucture: scaled / mean, ux: scaled / median };
}
