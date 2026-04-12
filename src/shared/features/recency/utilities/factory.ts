import { Temporal } from "@js-temporal/polyfill";
import { TEMPORAL_GRANULARITIES } from "../config";
import { TemporalFrequencies } from "../types";
import { generateZeroFrequencies } from "./frequencies";

export const recencyFactory = (now = Temporal.Now.zonedDateTimeISO()) => {
  const base = generateZeroFrequencies(now);

  const getTemporalFrequencies = (
    dates: Temporal.ZonedDateTime[]
  ): TemporalFrequencies => dates.reduce((acc, date) => TEMPORAL_GRANULARITIES
    .reduce((acc, granularity) => {
      const granularFrequencies = base[granularity];
      const breakdownKey = date[granularFrequencies.breakdownKey] as number;
      return {
        ...acc,
        [granularity]: {
          ...granularFrequencies,
          frequencies: {
            ...granularFrequencies.frequencies,
            [breakdownKey]: {
              ...granularFrequencies.frequencies[breakdownKey],
              value: granularFrequencies.frequencies[breakdownKey].value + 1,
            },
          },
        },
      };
    }, acc),
    {} as TemporalFrequencies
  );

  return {
    getTemporalFrequencies,
  };
};
