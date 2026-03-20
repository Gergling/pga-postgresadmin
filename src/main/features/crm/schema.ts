import { createSchema } from "../../../shared/lib/typesaurus/utilities";
import { CrmDbSchema } from "../../../shared/features/crm";

export const crmDb = createSchema<CrmDbSchema>(
  ['companies', 'people', 'employments']
);
