import { batch } from "typesaurus";
import { CreateFunction } from "../../../../shared/lib/typesaurus";
import {
  CrmCompanyCreation,
  CrmCompanyRecord,
  CrmCompanySummary,
  CrmCompanyTransfer,
  CrmCompanyUpdate,
  CrmEmployeeSummary,
  CrmEmployerSummary,
  CrmEmploymentRecord,
  CrmPersonCreation,
  CrmPersonRecord,
  CrmPersonSummary,
  CrmPersonTransfer,
  CrmPersonUpdate,
  summariseEmployee,
  summariseEmployer,
  transferCompany,
  transferPerson
} from "../../../../shared/features/crm";
import { docsMap } from "../../../libs/typesaurus";
import { crmDb } from "../schema";

// TODO: This is very repetitive, but trying to DRY it up as been physically painful, so I'm quitting while I'm less behind.

export const createCompany: CreateFunction<
  CrmCompanyCreation,
  CrmCompanyTransfer
> = async (
  data
) => {
  const queue = batch(crmDb);

  // Base
  const companyId = await crmDb.companies.id();
  const companySummary: CrmCompanySummary = {
    id: companyId,
    name: data.name,
  };

  // Get many-to-many joined data.
  const personIds = data.employees.map(({ person }) => person.id);
  const peopleDocs = await crmDb.people.many(personIds);
  const people = docsMap<CrmPersonRecord>(peopleDocs);

  // Generate ids from the join collection using the join elements.
  const employmentIds = await Promise.all(
    data.employees.map(({
      person: { id: personId }
    }) => crmDb.employments.id(`${companyId}-${personId}`))
  );

  // Create records for all possible joins.
  const employees = employmentIds.map((employmentId, idx): CrmEmployeeSummary => {
    const newEmployment = data.employees[idx];
    const { employers: existingEmployers } = people[idx];
    const { id: personId } = newEmployment.person;

    const employmentRecord: Omit<CrmEmploymentRecord, 'id'> = {
      ...newEmployment,
      company: companySummary,
    };
    const employerSummary: CrmEmployerSummary = summariseEmployer({
      id: employmentId,
      ...employmentRecord,
    });
    const personUpdate: Omit<CrmPersonUpdate, 'id'> = {
      employers: [...existingEmployers, employerSummary],
    };

    queue.employments.set(employmentId, employmentRecord);
    queue.people.update(personId, personUpdate);

    return {
      ...employmentRecord,
      id: employmentId,
    };
  });

  const company: CrmCompanyRecord = {
    ...data,
    employees,
    id: companyId,
  };

  queue.companies.set(companyId, company);

  await queue();

  return transferCompany(company);
};


export const createPerson: CreateFunction<CrmPersonCreation, CrmPersonTransfer> = async (
  data
) => {
  const queue = batch(crmDb);

  // Base
  const personId = await crmDb.people.id();
  const personSummary: CrmPersonSummary = {
    id: personId,
    name: data.name,
  };

  // Get many-to-many joined data.
  const companyIds = data.employers.map(({ company }) => company.id);
  const companiesDocs = await crmDb.companies.many(companyIds);
  const companies = companiesDocs.reduce((acc, doc): CrmCompanyRecord[] => {
    if (!doc) return acc;
    return [...acc, { id: doc.ref.id, ...doc.data }];
  }, []);
  const employmentIds = await Promise.all(
    data.employers.map(({
      company: { id: companyId }
    }) => crmDb.employments.id(`${companyId}-${personId}`))
  );


  // Create records for all possible joins.
  const employers = employmentIds.map((employmentId, idx): CrmEmployerSummary => {
    const newEmployment = data.employers[idx];
    const { employees: existingEmployees } = companies[idx];
    const { id: companyId } = newEmployment.company;

    const employmentRecord: Omit<CrmEmploymentRecord, 'id'> = {
      ...newEmployment,
      person: personSummary,
    };
    const employeeSummary: CrmEmployeeSummary = summariseEmployee({
      id: employmentId,
      ...employmentRecord,
    });
    const companyUpdate: Omit<CrmCompanyUpdate, 'id'> = {
      employees: [...existingEmployees, employeeSummary],
    };

    queue.employments.set(employmentId, employmentRecord);
    queue.companies.update(companyId, companyUpdate);

    return {
      ...employmentRecord,
      id: employmentId,
    };
  });

  const person: CrmPersonRecord = {
    ...data,
    employers,
    id: personId,
  };

  queue.people.set(personId, person);

  await queue();

  return transferPerson(person);
};
