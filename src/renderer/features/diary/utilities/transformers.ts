import {
  getTemporalZonedDateTime,
  // getTemporalZonedDateTimeGroupKey,
  TEMPORAL_ZONED_DATE_TIME_KEY_DENOMINATION_GROUPS,
} from "@/shared/lib/temporal";
import { aggregate } from "@/shared/utilities";
import { getRecencyGroups, RecencyGroupName } from "@/shared/features/recency";
import { PanelData } from "@/renderer/shared/dashboard";
import { DiaryEntryUi } from "../types";
import { Temporal } from "@js-temporal/polyfill";

// Raw dates
// A simple array of numbers

const map = ({ created: {
  epochMilliseconds
} }: DiaryEntryUi) => epochMilliseconds;

type DateSeries = {
  dates: number[]; recency: Record<RecencyGroupName, number>;
};

// Let's rethink this.
// Here's a list of properties from the class:
  // 'year',
  // 'month',
  // 'weekOfYear',
  // 'dayOfYear',
  // 'day', // of month
  // 'dayOfWeek',
  // 'hour',
  // 'minute',
  // 'second',
  // 'millisecond',
  // 'microsecond',
  // 'nanosecond',
// What I want to see is "most recents".
// So:
// this year, last year or the last 365 days by month
// this month, last month or the last 30 days, by day
// this week, last week or the last 7 days, by day
// today, yesterday or the last 24 hours, by hour
// Then we start from the bottom and work up.
// We can calculate all those dates and granularities in advance and generate
// when we need it.

// const getTheThings = (now = Temporal.Now.zonedDateTimeISO()): {
//   [Granularity in 'year' | 'month' | 'week' | 'day']: {
//     [since: number]: {

//     };
//   };
// } => {
//   return {
//     monthly: {
      
//     }
//   };
// };

const aggregateDates = (dates: number[]) => {
  // const keys = TEMPORAL_ZONED_DATE_TIME_KEY_DENOMINATION_GROUPS.forEach((keys) => {
  //   // getTemporalZonedDateTimeGroupKey(keys);
  // });
  const tzdts = dates.map((ms) => getTemporalZonedDateTime(ms));
  // Aggregate by a combined key of denominations increasing in granularity.
  // So `[year]`, `[year]-[month]`, etc...
  const idk = TEMPORAL_ZONED_DATE_TIME_KEY_DENOMINATION_GROUPS.forEach(
    (keys) => {
      const aggregation = aggregate(
        tzdts, (tzdt) => keys.map((key) => tzdt[key]).join('-')
      );
    }
  );
  // Once I have that, I want to select the ones with the most "impressive" entries
  // for the sparkline.
  // That means seeing whether all possible days in a week, month, etc are populated.
  // Which basically means starting from the high-granularity end and working
  // backwards looking for groups with a full set of non-zero entries.
  // Should I start by creating the aggregations with zero entries?
};

export const transformDiaryEntryPanels = (
  entries: DiaryEntryUi[]
): PanelData => {
  // const series = entries.map(map);
  const recency = entries?.reduce((acc, entry) => {
    const ms = map(entry);
    // If I want a sparkline, I'd have to create a list of grouped dates.
    const groups = getRecencyGroups(ms);
    return groups.reduce((acc, group) => ({
      ...acc,
      recency: {
        ...acc.recency,
        [group]: acc.recency[group] ? acc.recency[group] + 1 : 1,
      },
    }), acc);
  }, {} as DateSeries);
};
