export type Company = {
  id: string;
  name: string;
  employees: {
    contact: Person;
    employment: Employment;
  }[];
};

export type Person = {
  id: string;
  name: string;
  contactId: Partial<Record<'google', string>>; // Google and other contact ids.
  employers: {
    company: Company;
    employment: Employment;
  }[];
};

export type TimelineStatus = 'past' | 'future';

export type Employment = {
  id: string;          // Random Firestore ID

  // Relationship Metadata
  role?: string;        // e.g., "Full-stack Dev", "Consultant"
  company: Company;
  person: Person;
};
