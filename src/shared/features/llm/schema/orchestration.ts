import { SerialisedModelSummary } from "./model";
import { SerialisedOperationSummaryReliability } from "./operation";
import { LanguageModelProps } from "./transformers";

type LlmSourceModelResponseBase = {
  error?: unknown;
  source: string;
};
export type LlmSourceModelResponse = LlmSourceModelResponseBase & {
  models: LanguageModelProps[];
};
export type LlmOperationSummary = SerialisedModelSummary & {
  operation: string;
  reliability: SerialisedOperationSummaryReliability;
};
export type LlmSourceModel = {
  base: LanguageModelProps;
  history?: SerialisedModelSummary;
  operation: LlmOperationSummary[];
};
export type LlmListModelsResponse = LlmSourceModelResponseBase & {
  models: LlmSourceModel[];
};
