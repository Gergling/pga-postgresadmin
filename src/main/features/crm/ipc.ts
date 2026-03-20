import { createCrudConfig, IpcCrudConfig } from "../../ipc/utilities";
import {
  createCompany,
  createPerson,
  fetchCompany,
  fetchPerson,
  fetchRecentCompanies,
  fetchRecentPeople,
  updateCompany,
  updatePerson
} from "./crud";

export const crmIpc = createCrudConfig({
  create: {
    company: createCompany,
    person: createPerson,
  },
  update: {
    company: updateCompany,
    person: updatePerson,
  },
  read: {
    company: fetchCompany,
    person: fetchPerson,
    recentCompanies: fetchRecentCompanies,
    recentPeople: fetchRecentPeople,
  },
});

export type CrmIpc = typeof crmIpc
export type CrmIpcAwaited = IpcCrudConfig<CrmIpc>
