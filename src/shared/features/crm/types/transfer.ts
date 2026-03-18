import { TransferUpdate } from "../../../lib/typesaurus";
import { CrmCompanyPersistent, CrmPersonPersistent } from "./persistent";
import { CrmCompanySchema, CrmEmploymentSchema, CrmPersonSchema } from "./schema";
import { CrmCompanySummary, CrmEmployeeSummary, CrmEmployerSummary, CrmPersonSummary } from "./summary";

export type CrmCompanyTransfer = CrmCompanyPersistent & {
  employees: CrmEmployeeSummary[];
};

export type CrmPersonTransfer = CrmPersonPersistent & {
  employers: CrmEmployerSummary[];
};

type CrmEmployeeCreation = CrmEmploymentSchema & {
  person: CrmPersonSummary;
};

type CrmEmployerCreation = CrmEmploymentSchema & {
  company: CrmCompanySummary;
};

export type CrmCompanyCreation = CrmCompanySchema & {
  employees: CrmEmployeeCreation[];
};
export type CrmPersonCreation = CrmPersonSchema & {
  employers: CrmEmployerCreation[];
};

export type CrmCompanyUpdate = TransferUpdate<CrmCompanyTransfer>;
export type CrmPersonUpdate = TransferUpdate<CrmPersonTransfer>;
