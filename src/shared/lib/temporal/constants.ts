import { Temporal } from "@js-temporal/polyfill";
import { reduceInitialObject } from "@/shared/utilities/object";
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


// type X = {
//   [
//     K in keyof Temporal.ZonedDateTime
//   ]: K extends KeyType
//     ? K
//     : never;
// };
/**
 * This constant is for listing the Temporal.ZonedDateTime keys from lowest to
 * highest granularity. It's mostly for date sorting and aggregations.
 */
export const TEMPORAL_ZONED_DATE_TIME_KEY_DENOMINATIONS: (
  keyof Temporal.ZonedDateTime
)[] = [
    'year',
    'month',
    'weekOfYear',
    'dayOfYear',
    'day', // of month
    'dayOfWeek',
    'hour',
    'minute',
    'second',
    'millisecond',
    'microsecond',
    'nanosecond',
  ];

/**
 * Shortened Temporal.ZonedDateTimeKey to take up less space.
 */
type ZdtKey = (keyof Temporal.ZonedDateTime)[];
/**
 * This constant groups the Temporal.ZonedDateTime keys from lowest to
 * highest granularity.
 */
export const {
  acc: TEMPORAL_ZONED_DATE_TIME_KEY_DENOMINATION_GROUPS
} = TEMPORAL_ZONED_DATE_TIME_KEY_DENOMINATIONS.reduce(
  (acc2, tzdtsKey) => {
    const latest: ZdtKey = [...(acc2.previous ?? []), tzdtsKey];
    const acc = [...acc2.acc, latest];
    return { ...acc2, acc, previous: latest };
  }, { acc: [], previous: [] } as {
    acc: ZdtKey[];
    previous?: ZdtKey;
  }
);
