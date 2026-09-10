import { comparatorFactory } from "@/shared/utilities";
import { ModelClassification } from "../../schema";

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
