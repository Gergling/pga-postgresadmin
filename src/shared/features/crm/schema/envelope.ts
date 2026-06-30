import { envelopeSerialisationSchemaFactory } from "@shared/schema";
import {
  crmCompanyCoreSchema,
  crmEmploymentCoreSchema,
  crmPersonCoreSchema
} from "./core";
import z from "zod";

const basicSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const crmPersonSchema = envelopeSerialisationSchemaFactory({
  data: crmPersonCoreSchema,
  options: {
    relationships: {
      employers: z.array(basicSummarySchema).default([]),
    }
  }
});
export type CrmPerson = z.infer<typeof crmPersonSchema>;

export const crmCompanySchema = envelopeSerialisationSchemaFactory({
  data: crmCompanyCoreSchema,
  options: {
    relationships: {
      employees: z.array(basicSummarySchema).default([]),
    },
  }
});
export type CrmCompany = z.infer<typeof crmCompanySchema>;

export const crmEmploymentSchema = envelopeSerialisationSchemaFactory({
  data: crmEmploymentCoreSchema,
  options: {
    relationships: {
      employee: basicSummarySchema,
      employer: basicSummarySchema,
    },
  },
});
export type CrmEmployment = z.infer<typeof crmEmploymentSchema>;
