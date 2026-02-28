import { TypesaurusCore } from "typesaurus";
import { Archetype } from "../../lib/typesaurus";

type BaseEmployment = {
  role?: string;
};

type BaseCompany = {
  name: string;
};

type BasePerson = {
  name: string;
  contactId: Partial<Record<'google', string>>; // Google and other contact ids.
};

type Employee = BaseEmployment & {
  person: Person;
};
type Employer = BaseEmployment & {
  company: BaseCompany;
};

type Company = BaseCompany & {
  employees: Employee[];
};

type Person = BasePerson & {
  employers: Employer[];
};

export type TimelineStatus = 'past' | 'future';

type Employment = Employee & Employer;

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
