import { createCrudConfig, IpcCrudConfig } from "../../ipc/utilities";
import {
  createCompany,
  createEmployment,
  createPerson,
  deleteEmployment,
  fetchRecentCompanies,
  fetchRecentPeople,
  updateCompany,
  updatePerson
} from "./crud";

export const crmIpc = createCrudConfig({
  create: {
    company: createCompany,
    employment: createEmployment,
    person: createPerson,
  },
  update: {
    company: updateCompany,
    person: updatePerson,
  },
  read: {
    recentCompanies: fetchRecentCompanies,
    recentPeople: fetchRecentPeople,
  },
  delete: {
    employment: deleteEmployment,
  },
});

export type CrmIpc = typeof crmIpc
export type CrmIpcAwaited = IpcCrudConfig<CrmIpc>
