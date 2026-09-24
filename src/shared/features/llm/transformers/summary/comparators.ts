import { ComparatorFactory } from "@/shared/utilities";
import {
  LlmHistoryClassification,
  LlmHistoryRelative
} from "../../schema";

export const [
  compareLlmByExperimentalClassifications,
  compareLlmByStableClassifications,
] = ([
  [
    'potential', 'unreliable', 'untested', 'stable', 'unsuccessful'
  ],
  [
    'stable', 'potential', 'untested', 'unreliable', 'unsuccessful'
  ],
] satisfies LlmHistoryClassification[][]).map(
  (values) => ComparatorFactory.rank<LlmHistoryClassification>(
    values
  ).from<LlmHistoryRelative>((value) => value.classification)
);

const [
  divergence,
  experience,
  uxEfficiency,
] = ComparatorFactory.maps<LlmHistoryRelative>([
  ({ relative: { divergence } }) => divergence,
  ({ relative: { experience } }) => experience,
  ({ success: { efficiency: { ux } } }) => ux,
]);

export const compareLlmModelsForStability = ComparatorFactory.instantiate([
  compareLlmByStableClassifications,
  uxEfficiency.flip(),
  experience.flip(),
  divergence.flip(),
]);
export const compareLlmModelsForExperimentation = ComparatorFactory.instantiate([
  compareLlmByExperimentalClassifications,
  experience,
  divergence,
]);

export const compareLlmModelFactory = (stable: boolean) => (stable
  ? compareLlmModelsForStability
  : compareLlmModelsForExperimentation).run
  ;
