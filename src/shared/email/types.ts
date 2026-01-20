import { Temporal } from "@js-temporal/polyfill";

export type EmailFragmentStatus = 'new' | 'processing' | 'processed';

export type EmailFragment = {
  body: string;
  receivedAt: Temporal.PlainDateTime;
  from: string;
  id: string;
  source: 'gmail_important';
  status: EmailFragmentStatus;
  subject: string;
  db: {
    id: string;
    source: 'firebase';
  };
};
