import { ComparatorFactory } from "@/shared/utilities";
import { LlmHistoryRelative } from "../../schema";
import {
  compareExperimentalLlmClassifications,
  compareStableLlmClassifications
} from "./classification";

const classificationMap = ({
  classification
}: LlmHistoryRelative) => classification;

const [
  divergence,
  experience,
  uxEfficiency,
] = ComparatorFactory.maps<LlmHistoryRelative>([
  ({ relative: { divergence } }) => divergence,
  ({ relative: { experience } }) => experience,
  ({ success: { efficiency: { ux } } }) => ux,
]);

const experimentalClassifications = ComparatorFactory.instantiate(
  compareExperimentalLlmClassifications
).from(classificationMap);
const stableClassifications = ComparatorFactory.instantiate(
  compareStableLlmClassifications
).from(classificationMap);

export const compareLlmModelsForStability = ComparatorFactory.instantiate([
  stableClassifications,
  uxEfficiency.flip(),
  experience.flip(),
  divergence.flip(),
]);
export const compareLlmModelsForExperimentation = ComparatorFactory.instantiate([
  experimentalClassifications,
  experience,
  divergence,
]);

export const compareLlmModelFactory = (stable: boolean) => (stable
  ? compareLlmModelsForStability
  : compareLlmModelsForExperimentation).run
  ;
