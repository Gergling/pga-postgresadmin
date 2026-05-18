import { Temporal } from "@js-temporal/polyfill";
import { TEMPORAL_GRANULARITIES } from "../config";
import { TemporalFrequencies } from "../types";
import { generateZeroFrequencies, getFrequencyKey } from "./frequencies";

export const recencyFactory = (now = Temporal.Now.zonedDateTimeISO()) => {
  const base = generateZeroFrequencies(now);

  const getTemporalFrequencies = (
    dates: Temporal.ZonedDateTime[]
  ): TemporalFrequencies => {
    if (dates.length === 0) return base;
    const tf = dates.reduce((acc, date) => TEMPORAL_GRANULARITIES
      .reduce((acc, granularity) => {
        const granularFrequencies = base[granularity];
        const reset = granularFrequencies.reset;
        const breakdownKey = getFrequencyKey(reset(date));
        const temporalFrequency = granularFrequencies.frequencies[breakdownKey];
        const value = temporalFrequency ? temporalFrequency.value + 1 : 1;
        return {
          ...acc,
          [granularity]: {
            ...granularFrequencies,
            frequencies: {
              ...granularFrequencies.frequencies,
              [breakdownKey]: { ...temporalFrequency, value },
            },
          },
        };
      }, acc),
      {} as TemporalFrequencies
    );
    return TEMPORAL_GRANULARITIES.reduce((acc, granularity) => {
      const tfg = tf[granularity];
      console.log(tfg, granularity, tf)
      const populated = Object.values(tfg.frequencies).reduce(
        (worst, { category, value }) => {
          if (value > 0 || worst === 'insufficient') return worst;
          if (category === 'prior') return 'last';
          return 'insufficient';
        }, 'full'
      );
      return {
        ...acc,
        [granularity]: {
          ...tfg,
          summary: {
            populated,
          }
        },
      };
    }, tf);
  };

  return {
    getTemporalFrequencies,
  };
};
