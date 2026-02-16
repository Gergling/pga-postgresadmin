import { TypesaurusCore } from "typesaurus";
import { Archetype } from "../../lib/typesaurus";

type Company = {
  employees: {
    contact: Person;
    employment: Employment;
  }[];
};

type Person = {
  name: string;
  contactId: Partial<Record<'google', string>>; // Google and other contact ids.
  employers: {
    company: Company;
    employment: Employment;
  }[];
};

export type TimelineStatus = 'past' | 'future';

type Employment = {
  role?: string;
  company: Company;
  person: Person;
};

type EmploymentModelType = Omit<Employment, 'company' | 'person'> & {
  companyId: TypesaurusCore.Id<'companies'>;
  personId: TypesaurusCore.Id<'people'>;
};

export type CrmArchetype = Archetype<
  {
    companies: { base: Company; model: Omit<Company, 'employees'> };
    employments: {
      base: Employment;
      model: EmploymentModelType;
    };
    people: { base: Person; model: Omit<Person, 'id' | 'employers'> };
  }
>;

export type CrmCompanyId = CrmArchetype['id']['companies'];
export type CrmPersonId = CrmArchetype['id']['people'];
export type CrmEmploymentId = CrmArchetype['id']['employments'];
