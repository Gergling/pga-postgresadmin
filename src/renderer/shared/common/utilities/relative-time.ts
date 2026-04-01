import { Temporal } from "@js-temporal/polyfill";
import { getRelativeTimeString } from "@shared/lib/temporal";

// TODO: Function needs to be abstracted, since "now" can simply be "later" and
// the function doesn't change but the usage makes more sense.
export const getRelativeTimeNow = (
  earlier: Temporal.ZonedDateTime,
  now = Temporal.Now.zonedDateTimeISO()
) => {
  return now.since(earlier, { largestUnit: 'years' });
};
export const getRelativeTimeStringNow = (earlier: Temporal.ZonedDateTime) => {
  const duration = getRelativeTimeNow(earlier);
  return getRelativeTimeString(duration);
};
