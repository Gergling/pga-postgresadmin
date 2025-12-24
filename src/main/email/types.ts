import { EmailFragment } from "../../shared/email/types";

export type EmailSync = {
  message: string;
  success: false;
} | {
  data: EmailFragment[];
  success: true;
};

export type EmailHandlers = {
  syncEmails: () => Promise<EmailSync>;
};
