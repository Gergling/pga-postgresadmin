import { TypesaurusCore } from 'typesaurus'
import { Company, Employment, Person } from '../../../shared/types';
import { docsReduction, fetchMany } from '../../shared/db';
import { CompanyModelType, ContactModelType, crmDb, CrmSchema, EmploymentModelType } from './schema';

export const fetchManyEmployments = async (employmentIds: CrmSchema['employment']['Id'][]) => {
  // Load employments.
  const {
    map: employmentsMap
  } = await fetchMany<'employment', EmploymentModelType>(crmDb.employment, employmentIds);

  // Load the companies and people.
  const { contactIds, companyIds,  } = [...employmentsMap.values()].reduce((acc, employment) => {
    return {
      ...acc,
      companyIds: acc.companyIds.add(employment.data.companyId),
      contactIds: acc.contactIds.add(employment.data.personId),
    };
  }, {
    companyIds: new Set<TypesaurusCore.Id<"companies">>(),
    contactIds: new Set<TypesaurusCore.Id<"people">>(),
  });

  const [rawContacts, rawCompanies] = await Promise.all([
    crmDb.people.many([...contactIds]),
    crmDb.companies.many([...companyIds]),
  ]);

  const {
    map: companyMap,
    // notFound: notFoundCompanyIds,
  } = docsReduction<'companies', CompanyModelType>([...companyIds], rawCompanies);
  const {
    map: contactMap,
    // notFound: notFoundContactIds,
  } = docsReduction<'people', ContactModelType>([...contactIds], rawContacts);

  // Structure a map of contacts with companies and visa-versa.
  return [...employmentsMap.entries()].reduce(
    (acc, [employmentId, { data: { companyId, personId, ...employment }}]) => {
      const company = companyMap.get(companyId);
      if (!company) return acc;
      const contact = contactMap.get(personId);
      if (!contact) return acc;
      const baseCompany = {
        ...company.data,
        id: companyId,
        employees: [],
      };
      const baseContact = {
        ...contact.data,
        id: personId,
        employers: [],
      };
      const baseEmployment = {
        ...employment,
        company: baseCompany,
        contact: baseContact,
        id: employmentId,
      };

      const { employees } = acc.companies.get(companyId) ?? { employees: [] };
      const { employers } = acc.contacts.get(personId) ?? { employers: [] };

      // Note that employers and employees will always have empty employees
      // and employers themselves, as there is no point in going deeper. If we
      // need that information we can map it for lookup.
      const companies = acc.companies.set(companyId, {
        ...baseCompany,
        employees: [...employees, {
          contact: baseContact,
          employment: baseEmployment,
        }],
      });
      const contacts = acc.contacts.set(personId, {
        ...baseContact,
        employers: [...employers, {
          company: baseCompany,
          employment: baseEmployment,
        }],
      });
      const employments = acc.employments.set(employmentId, baseEmployment);

      return {
        companies,
        contacts,
        employments,
      };
    },
    {
      companies: new Map<TypesaurusCore.Id<"companies">, Company>(),
      contacts: new Map<TypesaurusCore.Id<'people'>, Person>(),
      employments: new Map<TypesaurusCore.Id<'employment'>, Employment & { company: Company, contact: Person }>(),
    }
  );
};
