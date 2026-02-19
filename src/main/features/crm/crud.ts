import { TypesaurusCore } from 'typesaurus'
import { Mandatory } from '../../../shared/types';
import { ArchetypeDefault, ArchetypeDoc, createCollectionMap } from '../../../shared/lib/typesaurus';
import { CrmArchetype } from '../../../shared/features/crm';
import { docsReduction } from '../../shared/db';
import { CompanyModelType, ContactModelType, crmDb } from './schema';

type FetchEmploymentModelsByProps = {
  type: 'companies';
  ids: CrmArchetype['id']['companies'][];
} | {
  type: 'people';
  ids: CrmArchetype['id']['people'][];
} | {
  type: 'employments';
  ids: CrmArchetype['id']['employments'][];
};

type EmploymentsModel = Omit<CrmArchetype['_registry']['employments']['model'], 'role'>;

type CollectionNameForeignKeyMap = {
  [ForeignKeyName in keyof EmploymentsModel as
    EmploymentsModel[ForeignKeyName] extends TypesaurusCore.Id<infer CollectionName>
    ? (CollectionName extends string ? CollectionName : never)
    : never
  ]: ForeignKeyName;
} & {
  employments?: never;
};

const collectionNameForeignKeyMap: CollectionNameForeignKeyMap = {
  companies: 'companyId',
  people: 'personId',
};

// We want to associate the collection name, to the id type.

type EmploymentDoc = ArchetypeDoc<CrmArchetype['_registry']['employments']>;
const fetchEmploymentModelsBy = async (
  { ids, type }: FetchEmploymentModelsByProps
): Promise<(EmploymentDoc | null)[]> => {
  if (type === 'employments') return crmDb.employments.many(ids);
  const foreignKey = collectionNameForeignKeyMap[type];

  return crmDb.employments.query(($) => $.field(foreignKey).in(ids));
};
const getEmploymentsMap = <CollectionName extends CrmArchetype['collectionName']>(
  { ids }: { ids: CrmArchetype['id'][CollectionName][], type: CollectionName },
  employments: (EmploymentDoc | null)[]
): {
  map: Map<CrmArchetype['id']['employments'], EmploymentDoc['data']>;
  notFound: CrmArchetype['id'][CollectionName][];
} => {
  return ids.reduce(
    ({ map, notFound }, id, i) => {
      const employment = employments[i];
      if (employment) return { map: map.set(employment.ref.id, employment.data), notFound };
      return { map, notFound: [...notFound, id] };
    },
    { map: new Map(), notFound: [] }
  );
};

const fetchEmploymentsBy = (
  map: Map<CrmArchetype['id']['employments'], EmploymentDoc['data']>
): {
  [CollectionName in CrmArchetype['collectionName']]: CrmArchetype['id'][CollectionName][];
} => {
  const ids = [...map.keys()];
  const { companyIds, contactIds, employmentIds } = [...map.values()].reduce((acc, employment, i) => {
    return {
      companyIds: acc.companyIds.add(employment.companyId),
      contactIds: acc.contactIds.add(employment.personId),
      employmentIds: acc.employmentIds.add(ids[i]),
    };
  }, {
    companyIds: new Set<CrmArchetype['id']['companies']>(),
    contactIds: new Set<CrmArchetype['id']['people']>(),
    employmentIds: new Set<CrmArchetype['id']['employments']>(),
  });
  return {
    companies: [...companyIds],
    people: [...contactIds],
    employments: [...employmentIds],
  };
};

// Employments can be loaded from a list of employment ids, company ids or person ids.
export const fetchManyEmployments = async (
  by: FetchEmploymentModelsByProps,
) => {
  // Load employments.
  const employments = await fetchEmploymentModelsBy(by);
  const { map: employmentsMap } = getEmploymentsMap(by, employments);
  const { companies: companyIds, people: contactIds } = fetchEmploymentsBy(employmentsMap);

  const [rawContacts, rawCompanies] = await Promise.all([
    crmDb.people.many(contactIds),
    crmDb.companies.many(companyIds),
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
    (acc, [employmentId, { companyId, personId, ...employment }]) => {
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
      const baseEmployment: CrmArchetype['base']['employments'] = {
        ...employment,
        company: baseCompany,
        person: baseContact,
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
      companies: createCollectionMap<CrmArchetype['_registry']['companies']>(),
      contacts: createCollectionMap<CrmArchetype['_registry']['people']>(),
      employments: createCollectionMap<CrmArchetype['_registry']['employments']>(),
    }
  );
};

// TODO: Review creation pattern. Also make sure they're always returning a base object.
// type CrudKey = 'create';// | 'update';
const crudFactory = <A extends ArchetypeDefault>(
  archetypeDb: TypesaurusCore.DB<A['collections']>,
  initialisers?: Partial<{
    [CollectionName in A['collectionName']]: {
      create?: (
        data: A['modelType'][CollectionName]
      ) => Promise<Omit<A['base'][CollectionName], keyof A['modelType'][CollectionName] | 'id'>>;
    };
  }>
) => {
  type ArchetypeModel = A['modelType'];
  type ValidCollectionName = A['collectionName'];
  return <
    CollectionName extends ValidCollectionName,
  >(
    collectionName: CollectionName
  ) => {
    type ModelType = ArchetypeModel[CollectionName];
    const collection = archetypeDb[collectionName];
    const collectionInitialisers = initialisers?.[collectionName];
    const initialisersRequired
    // : {
    //   create: (modelData: ModelType) => Promise<Omit<Base, keyof ModelType | 'id'>>;
    // }
    = {
      create: collectionInitialisers?.create ? collectionInitialisers.create : (async () => ({})),
    };

    // This creates an oddity with the id string so that it comes back as string | id type.
    // Will need to fix before using.
    const create = async (modelData: ModelType) => {
      const newPerson = await collection.add(modelData);
      const initialised = await initialisersRequired.create(modelData);
      return {
        ...modelData,
        ...initialised,
        id: newPerson.id,
      };
    };

    // type X = TypesaurusUpdate.ArgData<TypesaurusCore.CollectionDef<"people", Omit<Person, "id" | "employers">, false, false, false>, TypesaurusCore.DocProps & {
    //     environment: TypesaurusCore.RuntimeEnvironment;
    // }>
    // type Y = TypesaurusUpdate.ArgData<TypesaurusCore.CollectionDef<CollectionName, ModelType, false, false, false>, TypesaurusCore.DocProps & {
    //     environment: TypesaurusCore.RuntimeEnvironment;
    // }>
    // const cleanBaseData = ({ id, ...base }: Base): A['modelType'][CollectionName] => {
    //   return {
    //     ...base,
    //   };
    // };
    // const update = async (modelData: Mandatory<Base, 'id'>) => {
    //   return await collection.update(modelData.id, modelData);
    // };

    return {
      create: create,
      // update,
    };
  };
};

const crmCrudFactory = crudFactory<CrmArchetype>(crmDb, {
  companies: {
    create: async () => ({ employees: [] })
  },
  people: {
    create: async () => ({ employers: [] })
  },
});

export const createCompany = crmCrudFactory('companies').create;
export const createEmployment = crmCrudFactory('employments').create;
// export const createPerson = crmCrudFactory('people').create;
export const createPerson = async (modelData: CrmArchetype['modelType']['people']): Promise<CrmArchetype['base']['people']> => {
  const newPerson = await crmDb.people.add(modelData);
  return {
    ...modelData,
    employers: [],
    id: newPerson.id,
  };
};

export const fetchRecentCompanies = async () => {
  return await crmDb.companies.all();
};
export const fetchRecentPeople = async (): Promise<CrmArchetype['base']['people'][]> => {
  const people = await crmDb.people.all();
  return people.map(({ ref: { id }, data }) => ({
    ...data,
    employers: [],
    id,
  }));
};
// TODO: Also fetch by name search.

export const updatePerson = async (person: Mandatory<CrmArchetype['base']['people'], 'id'>) => {
  await crmDb.people.update(person.id, person);
  return person;
};
export const updateCompany = async (company: CrmArchetype['base']['companies']) => {
  return await crmDb.companies.update(company.id, company);
};

export const deleteEmployment = async (employmentId: CrmArchetype['id']['employments']) => {
  return await crmDb.employments.remove(employmentId);
};

