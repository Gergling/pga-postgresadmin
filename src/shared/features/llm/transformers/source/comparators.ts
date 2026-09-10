import { comparatorFactory, compareAlphabeticalAsc, compareUndefinedAsc } from "@/shared/utilities";
import { LlmSourceModel } from "../../schema";
import { compareLlmModelsForSource } from "../model/comparators";

const sourceModelComparatorFactory = comparatorFactory<LlmSourceModel>();
const compareLlmSourceModelsByName = sourceModelComparatorFactory.create(
  (a, b) => compareAlphabeticalAsc(a.base.name, b.base.name)
);
export const compareLlmSourceModelsByHistory = sourceModelComparatorFactory.stack([
  (a, b) => compareUndefinedAsc(b.history, a.history),
  (a, b) => a.history ? sourceModelComparatorFactory.map(
    ({ history }) => history,
    compareLlmModelsForSource
  )(a, b) : 0,
  compareLlmSourceModelsByName
]);
