import { Temporal } from "@js-temporal/polyfill";
import { getRelativeTimeString } from "@shared/lib/temporal";

/**
 * @deprecated Use shared/ equivalent.
 * @param start 
 * @param end 
 * @returns 
 */
export const getRelativeTimeNow = (
  start: Temporal.ZonedDateTime | Temporal.PlainDateTime,
  end = Temporal.Now.plainDateTimeISO()
) => {
  const startPlain = start instanceof Temporal.ZonedDateTime ? start.toPlainDateTime() : start;
  return startPlain.until(end, { largestUnit: 'years' });
};

/**
 * @deprecated Use shared/ equivalent.
 * @param earlier 
 * @param end 
 * @returns 
 */
export const getRelativeTimeStringNow = (
  earlier: Temporal.ZonedDateTime | Temporal.PlainDateTime,
  end = Temporal.Now.plainDateTimeISO()
) => {
  const duration = getRelativeTimeNow(earlier, end);
  return getRelativeTimeString(duration);
};
