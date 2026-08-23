import { comparatorFactory } from "@/shared/utilities";
import { ModelClassification } from "../schema";

const STABILITY_THRESHOLD = 5;

type Params = { failureCount: number; retryableCount: number; successCount: number; };
type Check = (props: Params) => boolean;


const experimentalRanking: ModelClassification[] = [
  'no-data', 'potential', 'retryable', 'stable', 'unsuccessful'
];
const stabilityRanking: ModelClassification[] = [
  'stable', 'potential', 'retryable', 'no-data', 'unsuccessful'
];

export const getModelActionClassification = (
  params: Params
): ModelClassification => ([
  { check: (props) => props.successCount > STABILITY_THRESHOLD, name: 'stable' },
  { check: (props) => props.successCount > 0, name: 'potential' },
  { check: (props) => props.failureCount > 0, name: 'unsuccessful' },
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
