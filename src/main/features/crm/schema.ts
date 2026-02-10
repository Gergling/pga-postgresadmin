// Possibly we want a schema folder in main/. This can go in a "crm.ts" file.

import { Company, Employment, Person } from "../../../shared/types";
import { schema, Typesaurus, TypesaurusCore } from "typesaurus";

export type CompanyModelType = Omit<Company, 'id' | 'employees'>;

export type ContactModelType = Omit<Person, 'id' | 'employers'>;

export type EmploymentModelType = Omit<Employment, 'id'> & {
  companyId: TypesaurusCore.Id<'companies'>;
  personId: TypesaurusCore.Id<'people'>;
}

// Generate the db object from given schem that you can use to access
// Firestore, i.e.:
//   await db.get(userId)
export const crmDb = schema(($) => ({
  companies: $.collection<CompanyModelType>(),
  people: $.collection<ContactModelType>(),
  employment: $.collection<EmploymentModelType>()
}));

// Infer schema type helper with shortcuts to types in your database:
//   function getUser(id: CrmSchema["users"]["Id"]): CrmSchema["users"]["Result"]
export type CrmSchema = Typesaurus.Schema<typeof crmDb>;
