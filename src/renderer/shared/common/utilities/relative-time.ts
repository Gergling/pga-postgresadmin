import { Temporal } from "@js-temporal/polyfill";
import { getRelativeTimeString } from "@shared/lib/temporal";

export const getRelativeTimeNow = (
  start: Temporal.ZonedDateTime | Temporal.PlainDateTime,
  end = Temporal.Now.plainDateTimeISO()
) => {
  const startPlain = start instanceof Temporal.ZonedDateTime ? start.toPlainDateTime() : start;
  return startPlain.until(end, { largestUnit: 'years' });
};
export const getRelativeTimeStringNow = (earlier: Temporal.ZonedDateTime) => {
  const duration = getRelativeTimeNow(earlier);
  return getRelativeTimeString(duration);
};
