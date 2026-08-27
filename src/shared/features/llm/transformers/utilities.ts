import { comparatorFactory } from "@/shared/utilities";
import { ModelClassification, SerialisedModelSummary } from "../schema";

const STABILITY_THRESHOLD = 5;
const RETRYABILITY_THRESHOLD = 10;
const UNRELIABILITY_THRESHOLD = 20;

type Params = { failureCount: number; retryableCount: number; successCount: number; };
type Check = (props: Params) => boolean;


const experimentalRanking: ModelClassification[] = [
  'no-data', 'potential', 'retryable', 'unreliable', 'stable', 'unsuccessful'
];
const stabilityRanking: ModelClassification[] = [
  'stable', 'potential', 'retryable', 'no-data', 'unreliable', 'unsuccessful'
];

export const getModelActionClassification = (
  params: Params
): ModelClassification => ([
  { check: (props) => props.successCount > STABILITY_THRESHOLD, name: 'stable' },
  { check: (props) => props.successCount > 0, name: 'potential' },
  {
    check: (props) =>
      props.failureCount > 0 || props.retryableCount > UNRELIABILITY_THRESHOLD,
    name: 'unsuccessful'
  },
  {
    check: (props) =>
      props.retryableCount > RETRYABILITY_THRESHOLD,
    name: 'unreliable'
  },
  { check: (props) => props.retryableCount > 0, name: 'retryable' },
] satisfies {
  check: Check;
  name: ModelClassification;
}[]).find(({ check }) => check(params))?.name ?? 'no-data';

const classificationComparatorFactory = comparatorFactory<
  ModelClassification
>();

export const compareExperimentalModelActionClassifications
  = classificationComparatorFactory.rank(experimentalRanking);
export const compareStableModelActionClassifications
  = classificationComparatorFactory.rank(stabilityRanking);

export const compareModelRuntimes = comparatorFactory<number>().create(
  (a, b) => {
    if (a <= 0) return 1;
    if (b <= 0) return -1;
    return a - b;
  }
);

const modelSummaryComparatorFactory = comparatorFactory<SerialisedModelSummary>();

const compareLlmModelFactory = (
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
const compareLlmModelsByRuns = modelSummaryComparatorFactory.create(
  (a, b) => b.count - a.count
);
const compareLlmModelsByRate = modelSummaryComparatorFactory.create(
  (a, b) => b.rate - a.rate
);
const compareLlmModelsByUxEfficiency = modelSummaryComparatorFactory.create(
  (a, b) => b.efficiency.ux - a.efficiency.ux
);

export const compareLlmModelsForStability = modelSummaryComparatorFactory.stack([
  compareLlmModelFactory(false),
  compareLlmModelsByUxEfficiency,
]);
export const compareLlmModelsForExperimentation = modelSummaryComparatorFactory.stack([
  compareLlmModelFactory(true),
  compareLlmModelsByRuns,
  compareLlmModelsByRate,
]);
