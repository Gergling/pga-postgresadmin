import { Temporal } from "@js-temporal/polyfill";
import { RecencyGroupName } from "../config";
import { RecencyThresholds } from "../types";

export const getRecencyThresholds = (
  now = Temporal.Now.zonedDateTimeISO()
): RecencyThresholds => {
  const beginningLastYear = now.with({
    year: now.year - 1, month: 1, day: 1, hour: 0, minute: 0, second: 0
  }).epochMilliseconds;
  const beginningThisYear = now.with({
    year: now.year, month: 1, day: 1, hour: 0, minute: 0, second: 0
  }).epochMilliseconds;
  const threeMonthsAgo = now.subtract({ months: 3 }).epochMilliseconds;
  const threeWeeksAgo = now.subtract({ weeks: 3 }).epochMilliseconds;
  const sevenDaysAgo = now.subtract({ days: 7 }).epochMilliseconds;
  const threeDaysAgo = now.subtract({ days: 3 }).epochMilliseconds;
  return {
    beginningLastYear,
    beginningThisYear,
    threeMonthsAgo,
    threeWeeksAgo,
    sevenDaysAgo,
    threeDaysAgo,
  };
};

export const getRecencyGroup = (
  milliseconds: number, {
    beginningLastYear,
    beginningThisYear,
    threeMonthsAgo,
    threeWeeksAgo,
    sevenDaysAgo,
  } = getRecencyThresholds()
): RecencyGroupName => {
  if (sevenDaysAgo < milliseconds) return 'recent days';
  if (threeWeeksAgo < milliseconds) return 'recent weeks';
  if (threeMonthsAgo < milliseconds) return 'recent months';
  if (beginningThisYear < milliseconds) return 'this year';
  if (beginningLastYear < milliseconds) return 'last year';
  return 'older';
};

export const getRecencyGroups = (
  milliseconds: number, {
    beginningLastYear,
    beginningThisYear,
    threeMonthsAgo,
    threeWeeksAgo,
    sevenDaysAgo,
  } = getRecencyThresholds()
): RecencyGroupName[] => {
  const groups: RecencyGroupName[] = [];
  if (sevenDaysAgo < milliseconds) groups.push('recent days');
  if (threeWeeksAgo < milliseconds) groups.push('recent weeks');
  if (threeMonthsAgo < milliseconds) groups.push('recent months');
  if (beginningThisYear < milliseconds) groups.push('this year');
  if (beginningLastYear < milliseconds) groups.push('last year');
  groups.push('older');
  return groups;
};
