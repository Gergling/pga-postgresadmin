import { createSchema } from "../../../shared/lib/typesaurus/utilities";
import { CrmDbSchema } from "../../../shared/features/crm";
import { createProcrastinatedRepo } from "@/main/libs/firebase";
import {
  CrmCompany,
  CrmEmployment,
  CrmPerson,
  crmCompanySchema,
  crmEmploymentSchema,
  crmPersonSchema
} from "@/shared/features/crm";

export const crmDb = createSchema<CrmDbSchema>(
  ['companies', 'people', 'employments']
);

export const crmPersonRepo = createProcrastinatedRepo<CrmPerson>(
  'people',
  crmPersonSchema
);

export const crmCompanyRepo = createProcrastinatedRepo<CrmCompany>(
  'companies',
  crmCompanySchema
);

export const crmEmploymentRepo = createProcrastinatedRepo<CrmEmployment>(
  'employments',
  crmEmploymentSchema
);
