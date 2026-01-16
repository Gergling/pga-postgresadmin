import { reduceInitialObject } from "../../utilities/object";
import { TEMPORAL_UNIT_PROPS_EXTENDED } from "./config";
import { TemporalUnitPropExtended, TemporalUnitPropSingularisedMap } from "./types";

const singularise = (
  acc: TemporalUnitPropSingularisedMap,
  prop: TemporalUnitPropExtended
): TemporalUnitPropSingularisedMap => ({
  ...acc,
  [prop]: prop.substring(0, prop.length - 1),
});

export const TEMPORAL_UNIT_PROPS_SINGULARISED: TemporalUnitPropSingularisedMap
  = reduceInitialObject<TemporalUnitPropExtended, string>(TEMPORAL_UNIT_PROPS_EXTENDED, singularise);
