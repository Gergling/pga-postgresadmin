import { SummariseFunction } from "../../../lib/typesaurus";
import {
  CrmCompanyRecord,
  CrmCompanySummary,
  CrmCompanyTransfer,
  CrmEmployeeSummary,
  CrmEmployerSummary,
  CrmEmploymentRecord,
  CrmPersonRecord,
  CrmPersonSummary,
  CrmPersonTransfer
} from "../types";

// Yes, these functions don't do much. They're for standardisation.

export const summariseCompany: SummariseFunction<
  CrmCompanyTransfer,
  CrmCompanySummary
> = ({ id, name }) => ({ id, name });

export const summariseEmployer: SummariseFunction<
  CrmEmploymentRecord,
  CrmEmployerSummary
> = (record) => record;

export const summariseEmployee: SummariseFunction<
  CrmEmploymentRecord,
  CrmEmployeeSummary
> = (record) => record;

export const summarisePerson: SummariseFunction<
  CrmPersonTransfer,
  CrmPersonSummary
> = ({ id, name }) => ({ id, name });

export const transferCompany = (company: CrmCompanyRecord): CrmCompanyTransfer => company;
export const transferPerson = (person: CrmPersonRecord): CrmPersonTransfer => person;
