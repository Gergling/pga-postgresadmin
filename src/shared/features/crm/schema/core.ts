import z from "zod";
import { serialisationDateSchema } from "@/shared/schema";

export const crmPersonCoreSchema = z.object({
  name: z.string(),
  contactId: z.object({
    google: z.string(),
  }).partial().default({}),
});

export const crmCompanyCoreSchema = z.object({
  name: z.string(),
});

export const crmEmploymentTenureSchema = z.union([
  z.literal('past'),
  serialisationDateSchema,
  z.object({
    earliest: z.number(),
    start: z.number().optional(),
    latest: z.number(),
    end: z.number().optional(),
  }),
]);

export const crmEmploymentCoreSchema = z.object({
  role: z.string().optional(),
  tenure: crmEmploymentTenureSchema.optional(),
});
