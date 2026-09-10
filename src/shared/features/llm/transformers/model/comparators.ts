import { comparatorFactory } from "@/shared/utilities";
import { SerialisedModelSummary } from "../../schema";
import { compareExperimentalModelActionClassifications, compareStableModelActionClassifications } from "./classification";

const modelSummaryComparatorFactory = comparatorFactory<SerialisedModelSummary>();

const compareLlmModelClassificationFactory = (
  experimental?: boolean
) => {
  const comparator = experimental
    ? compareExperimentalModelActionClassifications
    : compareStableModelActionClassifications
    ;
  return modelSummaryComparatorFactory.create(
    (a, b) => comparator(a.classification, b.classification)
  );
};
const compareLlmModelsByNonRetryableRuns = modelSummaryComparatorFactory.create(
  (a, b) => b.count.success - a.count.success
);
const compareLlmModelsByRuns = modelSummaryComparatorFactory.create(
  (a, b) => b.count.all - a.count.all
);
const compareLlmModelsByRate = modelSummaryComparatorFactory.create(
  (a, b) => b.rate - a.rate
);
const compareLlmModelsByUxEfficiency = modelSummaryComparatorFactory.create(
  (a, b) => b.efficiency.ux - a.efficiency.ux
);

export const compareLlmModelsForStability = modelSummaryComparatorFactory.stack([
  compareLlmModelClassificationFactory(false),
  compareLlmModelsByUxEfficiency,
  compareLlmModelsByRuns,
]);
export const compareLlmModelsForExperimentation = modelSummaryComparatorFactory.stack([
  compareLlmModelClassificationFactory(true),
  compareLlmModelsByNonRetryableRuns,
  compareLlmModelsByRuns,
  compareLlmModelsByRate,
]);

export const compareLlmModelsForSource = modelSummaryComparatorFactory.stack([
  compareLlmModelClassificationFactory(false),
  compareLlmModelClassificationFactory(true),
  compareLlmModelsByUxEfficiency,
  compareLlmModelsByRuns,
  compareLlmModelsByRate,
]);

export const compareLlmModelFactory = (stable: boolean) => stable
  ? compareLlmModelsForStability
  : compareLlmModelsForExperimentation
  ;
