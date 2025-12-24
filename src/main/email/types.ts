export type EmailSync = { success: boolean; message: string; };

export type EmailHandlers = {
  syncEmails: () => Promise<EmailSync>;
};
