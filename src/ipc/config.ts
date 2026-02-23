import { IpcHandlerConfig, IpcInvocationConfigBase } from '../libs/ipc';
import { IpcHandlerDatabase } from '../main/database/types';
import { DockerCommands } from '../main/docker/types';
import { TasksIpc, UserTask } from '../shared/features/user-tasks/types';
import { DatabaseItem, DatabaseResponseSelect } from '../shared/database/types';
import {
  DatabaseServerCredentials,
  DockerPullPostgresChannel
} from '../shared/docker-postgres/types';
import { GeneralResponse, Mandatory, MutationResponse } from '../shared/types';
import { DiaryEntry, DiaryIpc, DiaryIpcCreateEntry } from '../shared/features/diary/types';
import { TriageTasksParameters, TriageTasksResponse } from '../main/features/tasks/types';
import { ManageEnvironment } from '../main/environment/types';
import { EnvironmentProps } from '../main/shared/environment';
import { CrmIpc, CrmIpcAwaited } from '../main/features/crm';
import { JobSearchIpc, JobSearchIpcAwaited } from '../main/features/job-search';

// Minimalist configuration type for the renderer side.
// IpcInvocationConfigBase really just makes these functions return promises.
// Many of these functions aren't in use anymore, but I've kept them because
// they worked and handled things I wasn't necessarily good at, so I've got
// examples of how to make them work again in the future.
export type IpcInvocationConfig = IpcInvocationConfigBase<{
  // For testing that IPC is working.
  testIPC: (message: string) => string;

  // From a previous project just for playing with a docker-based database.
  // Is no longer in use but most of the code is still present.
  createDatabase: (dbName: string) => { success: boolean; error?: string };
  selectDatabases: () => DatabaseResponseSelect<DatabaseItem>;

  loadDatabaseServerCredentials: () => DatabaseServerCredentials | undefined;
  saveDatabaseServerCredentials: (credentials: DatabaseServerCredentials) => GeneralResponse;

  // Everything below this comment is in use.
  triageEmailTasks: () => TriageTasksResponse;
  triageTasks: (params: TriageTasksParameters) => TriageTasksResponse;

  readIncompleteTasks: () => UserTask[];
  readTaskForId: (taskId: string) => UserTask;
  updateTask: (taskId: string, newData: Partial<UserTask>) => UserTask;

  getEnvironment: () => EnvironmentProps;
  setEnvironment: (env: EnvironmentProps) => MutationResponse<EnvironmentProps>;

  createDraftDiaryEntry: DiaryIpcCreateEntry;
  fetchRecentDiaryEntries: () => DiaryEntry[];
  updateDiaryEntry: (
    id: string,
    newData: Partial<DiaryEntry>,
    immediateConvergence?: boolean
  ) => Mandatory<DiaryEntry, 'id'>;

  // CRM and job search.
  assignEmployment: CrmIpcAwaited['create']['employment'];
  createApplication: JobSearchIpcAwaited['create']['application'];
  createCompany: CrmIpcAwaited['create']['company'];
  createInteraction: JobSearchIpcAwaited['create']['interaction'];
  createPerson: CrmIpcAwaited['create']['person'];
  deleteEmployment: CrmIpcAwaited['delete']['employment'];
  fetchActiveApplications: JobSearchIpcAwaited['read']['activeApplications'];
  fetchRecentCompanies: CrmIpcAwaited['read']['recentCompanies'];
  fetchRecentInteractions: JobSearchIpcAwaited['read']['recentInteractions'];
  fetchRecentPeople: CrmIpcAwaited['read']['recentPeople'];
  updateApplication: JobSearchIpcAwaited['update']['application'];
  updateCompany: CrmIpcAwaited['update']['company'];
  updateInteraction: JobSearchIpcAwaited['update']['interaction'];
  updatePerson: CrmIpcAwaited['update']['person'];
}>;

export type IpcAdditionalParameters = {
  crm: CrmIpc
  database: IpcHandlerDatabase;
  docker: DockerCommands;
  diary: DiaryIpc;
  environment: ManageEnvironment;
  jobSearch: JobSearchIpc;
  tasks: TasksIpc;
  triage: {
    triageEmailTasks: () => Promise<TriageTasksResponse>;
    triageTasks: (params: TriageTasksParameters) => Promise<TriageTasksResponse>;
  };
};

// The handler configuration will run functions from the backend.
// This example includes a (custom) database handler object, which
// simply allows access to static functions.
// See type comments above for which functions are actually in use.
export const ipcHandlerConfig: IpcHandlerConfig<
  IpcInvocationConfig,
  IpcAdditionalParameters
> = {
  testIPC: async ({ args: [message] }) => {
    console.log('IPC test received:', message);
    return `Received: ${message}`;
  },
  createDatabase: ({
    args: [dbName],
    database: { createDatabase },
  }) => createDatabase(dbName),
  selectDatabases: ({
    database: { selectDatabases }
  }) => selectDatabases(),

  loadDatabaseServerCredentials: ({
    docker: { loadDatabaseServerCredentials },
  }) => loadDatabaseServerCredentials(),
  saveDatabaseServerCredentials: ({
    args: [credentials],
    docker: { saveDatabaseServerCredentials },
  }) => saveDatabaseServerCredentials(credentials),

  // This is somewhat temporary and primarily for testing emails.
  triageEmailTasks: ({ triage: { triageEmailTasks } }) => triageEmailTasks(),
  
  // Everything below this comment is in use.
  triageTasks: async ({
    args: [params],
    triage: { triageTasks }
  }) => triageTasks(params),
  readIncompleteTasks: ({ tasks: { read: { incomplete } } }) => incomplete(),
  readTaskForId: ({
    args: [taskId],
    tasks: { read: { forId } },
  }) => forId(taskId),
  updateTask: ({
    args: [taskId, newData],
    tasks: { update: { set } },
  }) => set(taskId, newData),

  getEnvironment: ({ environment: { get } }) => get(),
  setEnvironment: ({
    args: [env],
    environment: { set },
  }) => set(env),

  createDraftDiaryEntry: ({
    args: [entry],
    diary: { create: { entry: createDraftDiaryEntry } },
  }) => createDraftDiaryEntry(entry),
  fetchRecentDiaryEntries: ({
    diary: { read: { recent } },
  }) => recent(),
  updateDiaryEntry: ({
    args: [id, newData, immediateConvergence],
    diary: { update: { set } },
  }) => set(id, newData, immediateConvergence),

  // CRM and job search.
  assignEmployment: ({
    args: [employment],
    crm: { create: { employment: createEmployment } },
  }) => createEmployment(employment),
  createApplication: ({
    args: [application],
    jobSearch: { create: { application: createApplication } },
  }) => createApplication(application),
  createCompany: ({
    args: [company],
    crm: { create: { company: createCompany } },
  }) => createCompany(company),
  createInteraction: ({
    args: [interaction],
    jobSearch: { create: { interaction: createInteraction } },
  }) => createInteraction(interaction),
  createPerson: ({
    args: [person],
    crm: { create: { person: createPerson } },
  }) => createPerson(person),
  deleteEmployment: ({
    args: [employmentId],
    crm: { delete: { employment: deleteEmployment } },
  }) => deleteEmployment(employmentId),
  fetchActiveApplications: ({
    jobSearch: { read: { activeApplications } },
  }) => activeApplications(),
  fetchRecentCompanies: ({
    crm: { read: { recentCompanies } },
  }) => recentCompanies(),
  fetchRecentInteractions: ({
    jobSearch: { read: { recentInteractions } },
  }) => recentInteractions(),
  fetchRecentPeople: ({
    crm: { read: { recentPeople } },
  }) => recentPeople(),
  updateApplication: ({
    args: [application],
    jobSearch: { update: { application: updateApplication } },
  }) => updateApplication(application),
  updateCompany: ({
    args: [company],
    crm: { update: { company: updateCompany } },
  }) => updateCompany(company),
  updateInteraction: ({
    args: [interaction],
    jobSearch: { update: { interaction: updateInteraction } },
  }) => updateInteraction(interaction),
  updatePerson: ({
    args: [person],
    crm: { update: { person: updatePerson } },
  }) => updatePerson(person),
};

export const EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED = 'window-focused';
export const EVENT_SUBSCRIPTION_RITUAL_TELEMETRY = 'ritual-telemetry';

export type WindowEvents = typeof EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED;
export type RitualTelemetryEvents = typeof EVENT_SUBSCRIPTION_RITUAL_TELEMETRY;
export type EventSubscriptionChannel =
  | DockerPullPostgresChannel
  | WindowEvents
  | RitualTelemetryEvents
;
