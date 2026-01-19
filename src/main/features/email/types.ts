import { EmailFragment } from "../../../shared/email/types";

export type EmailSync = {
  data: string;
  status: 'email';
} | {
  data: string;
  status: 'triage';
} | {
  data: EmailFragment[];
  status: 'success';
};

export type EmailHandlers = {
  syncEmails: () => Promise<EmailSync>;
};
