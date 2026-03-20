import { CrmCompanyTransfer, CrmPersonTransfer } from "../../../../shared/features/crm";
import { UpdateFunction } from "../../../../shared/lib/typesaurus";
import { crmDb } from "../schema";

export const updatePerson: UpdateFunction<
  CrmPersonTransfer,
  CrmPersonTransfer
> = async (person) => {
  await crmDb.people.update(person.id, person);
  return person;
};
export const updateCompany: UpdateFunction<
  CrmCompanyTransfer,
  CrmCompanyTransfer
> = async (company) => {
  await crmDb.companies.update(company.id, company);
  return company;
};
