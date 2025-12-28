import { Temporal } from "@js-temporal/polyfill";

export const getPlainDateTimeFromDate = (date: Date) => {
  try {
    const instant = Temporal.Instant.from(date.toISOString());
    return instant.toZonedDateTimeISO(Temporal.Now.timeZoneId()).toPlainDateTime();
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
