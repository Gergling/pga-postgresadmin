import { CrmCompanyTransfer, CrmDbSchema, CrmPersonTransfer } from "../../../../shared/features/crm";
import { FetchItemFunction, FetchListFunction } from "../../../../shared/lib/typesaurus";
import { crmDb } from "../schema";

export const fetchCompany: FetchItemFunction<
  CrmDbSchema['id']['companies'],
  CrmCompanyTransfer
> = async (id) => {
  const model = await crmDb.companies.get(id);
  if (!model) return null;
  return {
    ...model.data,
    id,
  };
};

export const fetchPerson: FetchItemFunction<
  CrmDbSchema['id']['people'],
  CrmPersonTransfer
> = async (id) => {
  const model = await crmDb.people.get(id);
  if (!model) return null;
  return {
    ...model.data,
    id,
  };
};

export const fetchRecentCompanies: FetchListFunction<
  void,
  CrmCompanyTransfer
> = async () => {
  const companies = await crmDb.companies.all();
  return companies.map(({ ref: { id }, data }) => ({
    ...data,
    id,
  }))
};
export const fetchRecentPeople: FetchListFunction<
  void,
  CrmPersonTransfer
> = async () => {
  const people = await crmDb.people.all();
  return people.map(({ ref: { id }, data }) => ({
    ...data,
    id,
  }));
};