import { Temporal } from "@js-temporal/polyfill";

export type EmailFragment = {
  subject: string;
  from: string;
  date: Temporal.PlainDateTime;
  body: string;
};
