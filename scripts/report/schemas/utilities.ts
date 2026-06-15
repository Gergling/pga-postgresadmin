import { Temporal } from "@js-temporal/polyfill";

export const getNow = () => Temporal.Now.zonedDateTimeISO().toString();
