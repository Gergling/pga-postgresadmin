import { ComparatorFactory, comparatorFactory } from "@/shared/utilities";
import { LlmHistoryClassification, LlmHistoryRelative, ModelClassification } from "../../schema";

const STABILITY_THRESHOLD = 5;
const RETRYABILITY_THRESHOLD = 5;
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
  // TODO: Need to include the largest number of successful runs for all models.
  // If this number of successful runs exceeds more than half that number, it's
  // stable.
  // If half the total successful runs is <= 1, then it cannot be stable.
  { check: (props) => props.successCount > STABILITY_THRESHOLD, name: 'stable' },
  { check: (props) => props.successCount > 0, name: 'potential' },
  // Use the largest number of terminal runs per model-operation across all
  // model-operation combinations as the unreliability threshold.
  // If that's <= 1, then it cannot be unsuccessful.
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

/**
 * @deprecated Use `compareSummaryClassifications` instead.
 */
export const compareExperimentalModelActionClassifications
  = classificationComparatorFactory.rank(experimentalRanking);
/**
 * @deprecated Use `compareSummaryClassifications` instead.
 */
export const compareStableModelActionClassifications
  = classificationComparatorFactory.rank(stabilityRanking);

export const getSummaryClassification = ({
  aggregation: { successful, total },
  runs: { failures },
}: {
  aggregation: Pick<LlmHistoryRelative['aggregation'], 'successful' | 'total'>;
  runs: Pick<LlmHistoryRelative['runs'], 'failures'>;
}, {
  maximumTotalRuns,
  proportionalSuccess,
}: {
  /**
   * The maximum total number of runs for any model.
   */
  maximumTotalRuns: number;
  /**
   * The proportion of successful runs to total runs, scaled to a value between 0 and 1.
   */
  proportionalSuccess: number;
}): LlmHistoryClassification => {
  // Stability is classified when there are at least 2 successful runs AND
  // there must have been at least 5 runs across all models (which could still
  // be just this one model, which we don't care about too much).
  // This classification is "terminal" for stable models, unless success rate
  // decreases.
  if (proportionalSuccess >= 0.5 && successful > 1) return 'stable';

  // Potential is classified when there are any successful runs. This category
  // is the highest experimental priority to ensure it is cleared from this
  // category as soon as possible.
  // This classification should never be "terminal" and should always be as
  // volatile as possible to be either upgraded to stable or downgraded to
  // unsuccessful. It should be the highest priority for experimentation and
  // second highest priority to stable models.
  if (successful > 0) return 'potential';

  // Unsuccessful is classified when more than half the maximum runs of any
  // model were failures.
  // This classification should be "terminal" because it will be consistently
  // the lowest priority to test.
  if (failures > maximumTotalRuns / 2) return 'unsuccessful';

  // Untested is classified when there are no runs.
  // This classification should not be "terminal" as experimental runs should
  // be looking for new options, and stable runs should be looking for something
  // better than unsuccessful.
  if (total === 0) return 'untested';

  // Unreliable is classified when nothing else applies. There are runs, but
  // none are successful, and there aren't enough failures to assume it can't
  // succeed at all.
  // Volatility is greater for experimental runs as anything with potential
  // will be classified as such.
  return 'unreliable';
}
