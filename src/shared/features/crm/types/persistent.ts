import { Schema } from "@shared/lib/typesaurus";
import {
  CrmCompanySchema,
  CrmEmploymentSchema,
  CrmPersonSchema
} from "./schema";

export type CrmSchema = Schema<{
  companies: CrmCompanySchema;
  employments: CrmEmploymentSchema;
  people: CrmPersonSchema;
}>;

export type CrmCompanyPersistent = CrmSchema['persistent']['companies'];
export type CrmEmploymentPersistent = CrmSchema['persistent']['employments'];
export type CrmPersonPersistent = CrmSchema['persistent']['people'];
