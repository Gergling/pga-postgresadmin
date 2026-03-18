import { DbSchema } from "../../../lib/typesaurus";
import { CrmCompanyPersistent, CrmEmploymentPersistent, CrmPersonPersistent, CrmSchema } from "./persistent";
import { CrmCompanySummary, CrmEmployeeSummary, CrmEmployerSummary, CrmEmploymentSummary, CrmPersonSummary } from "./summary";

// We don't have a lot of information stored against companies and people at this time, so the record is currently just the summary.
export type CrmCompanyRecord =
  & CrmCompanyPersistent
  & CrmCompanySummary
  & Record<'employees', CrmEmployeeSummary[]>
;
export type CrmEmploymentRecord = 
  & CrmEmploymentPersistent
  & CrmEmploymentSummary
;
export type CrmPersonRecord = 
  & CrmPersonPersistent
  & CrmPersonSummary
  & Record<'employers', CrmEmployerSummary[]>
;

export type CrmDbSchema = DbSchema<CrmSchema, {
  companies: CrmCompanyRecord;
  employments: CrmEmploymentRecord;
  people: CrmPersonRecord;
}>;
