import { createSchema } from "../../../shared/lib/typesaurus/utilities";
import { CrmArchetype } from "../../../shared/features/crm";

type ModelType = CrmArchetype['modelType'];

export type CompanyModelType = ModelType['companies'];

export type ContactModelType = ModelType['people'];

export type EmploymentModelType = ModelType['employments'];

export const crmDb = createSchema<CrmArchetype>(['companies', 'people', 'employments']);
