import { Temporal } from "@js-temporal/polyfill";
import { TEMPORAL_UNIT_PROPS_SINGULARISED } from "./constants";
import { TemporalUnitProp, TemporalUnitPropExtended } from "./types";
import { TEMPORAL_UNIT_PROPS } from "./config";

export const getReadableUnit = (
  value: number,
  prop: TemporalUnitPropExtended,
) => value === 1 ? TEMPORAL_UNIT_PROPS_SINGULARISED[prop] : prop;

export const getReadableFormat = (
  value: number,
  unit: string,
) => `${value} ${unit} ago`;

export const getRelativePropTimeString = (
  value: number,
  prop: TemporalUnitPropExtended
): string => getReadableFormat(value, getReadableUnit(value, prop));

export const getExtendedLogicValue = (
  value: number,
  prop: TemporalUnitProp
): { prop: TemporalUnitPropExtended, value: number } => {
  if (prop === 'days' && value >= 7) {
    const weeks = Math.floor(value / 7);
    return { value: weeks, prop: 'weeks' };
  }

  return { prop, value };
}

export const getRelativeTimeString = (
  duration: Temporal.Duration
) => {
  // Props are deliberately ordered from lowest granularity to highest.
  // The first one to be greater than 0 is the highest order of magnitude in
  // the date/time with a non-zero measurement.
  const prop = TEMPORAL_UNIT_PROPS.find((prop) => duration[prop] > 0);

  // If no prop, was updated less than a second ago.
  if (!prop) return `just now`;

  // 
  const {
    prop: extendedProp,
    value
  } = getExtendedLogicValue(duration[prop], prop);

  return getRelativePropTimeString(value, extendedProp);
};
