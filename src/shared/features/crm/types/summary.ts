import { Summary } from "../../../lib/typesaurus";
import {
  CrmCompanyPersistent,
  CrmEmploymentPersistent,
  CrmPersonPersistent
} from "./persistent";

export type CrmCompanySummary = Summary<CrmCompanyPersistent, 'name'>;
export type CrmPersonSummary = Summary<CrmPersonPersistent, 'name'>;

export type CrmEmployeeSummary = CrmEmploymentPersistent & {
  person: CrmPersonSummary;
};
export type CrmEmployerSummary = CrmEmploymentPersistent & {
  company: CrmCompanySummary;
};

export type CrmEmploymentSummary = CrmEmployeeSummary & CrmEmployerSummary;
