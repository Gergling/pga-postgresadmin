import { TEMPORAL_UNIT_PROPS, TEMPORAL_UNIT_PROPS_CUSTOM } from "./config";

export type TemporalUnitProp = typeof TEMPORAL_UNIT_PROPS[number];
export type TemporalUnitPropExtended = TemporalUnitProp | typeof TEMPORAL_UNIT_PROPS_CUSTOM[number];
export type TemporalUnitPropSingularisedMap = Record<TemporalUnitPropExtended, string>;
