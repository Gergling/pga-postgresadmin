import { Temporal } from "@js-temporal/polyfill";

export type EmailFragment = {
  body: string;
  receivedAt: Temporal.PlainDateTime;
  from: string;
  id: string;
  source: 'gmail_important';
  status: 'new' | 'processed';
  subject: string;
  db: {
    id: string;
    source: 'firebase';
  };
};
