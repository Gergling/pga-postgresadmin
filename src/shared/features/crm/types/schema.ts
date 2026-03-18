export type CrmCompanySchema = {
  name: string;
};

type Tenure = 
  | 'past' // Was employed there in the past, but not anymore.
  | number // Was employed there on this date.
  | ((
    {
      earliest: number; // Earliest time employed there.
    } & {
      start?: number; // Start date.
    }
  ) & (
    {
      latest: number; // Latest time employed there.
    } & {
      end?: number; // End date.
    }
  ));

export type CrmEmploymentSchema = {
  role?: string;
  tenure?: Tenure; // Undefined if unknown.
};

export type CrmPersonSchema = {
  name: string;
  contactId: Partial<Record<'google', string>>; // Mainly for Google contacts, but also there may be other such services.
};
