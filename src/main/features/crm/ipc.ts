import { tRPC } from "@/main/config";
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

export const crmRouter = tRPC.router({
  createCompany: tRPC.procedure.input(CrmCompanyCreationSchema).mutation(createCompany),
  createPerson: tRPC.procedure.input(CrmCompanyCreationSchema).mutation(createCompany),
  fetchCompany: tRPC.procedure.input(CrmCompanyCreationSchema).mutation(createCompany),
  fetchPerson: tRPC.procedure.input(CrmCompanyCreationSchema).mutation(createCompany),
  fetchRecentCompanies: tRPC.procedure.input(CrmCompanyCreationSchema).mutation(createCompany),
  fetchRecentPeople: tRPC.procedure.input(CrmCompanyCreationSchema).mutation(createCompany),
  updateCompany: tRPC.procedure.input(CrmCompanyCreationSchema).mutation(createCompany),
  updatePerson: tRPC.procedure.input(CrmCompanyCreationSchema).mutation(createCompany),
  // devEnabled: tRPC.procedure.query(() => isFirebaseDevEnabled),
  // get: tRPC.procedure.query(async () => {
  //   const value = await loadElectronSettings('env');
  //   return EnvironmentPropsSchema.parse(value);
  // }),
  // mode: tRPC.procedure.query(() => RUN_MODE),
  // set: tRPC.procedure.input(EnvironmentPropsSchema).mutation(
  //   async ({ input: env }) => {
  //     await task(
  //       `Switching to ${env} environment`,
  //       async ({ task }) => {
  //         await task(
  //           `Setting`,
  //           () => saveElectronSettings('env', env)
  //         );
  //         await task(
  //           `Initialising Firebase`,
  //           ({ task }) => initializeFirebase(task)
  //         );
  //       }
  //     )
  //     getVessel()?.reload();
  //     return {
  //       success: true,
  //       data: env
  //     };
  //   }
  // ),
});

