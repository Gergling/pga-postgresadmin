import {
  TaskRelationshipBase,
  TaskSourceType,
  UserTask,
  UserTaskAudit
} from "../../../shared/features/user-tasks";

export type TriageTasksStatus = 'success' | 'error';

export type TriageTasksResponse = {
  message: string;
  source: TaskSourceType;
  status: TriageTasksStatus;
};

export type TriageTasksParameters = {
  source: 'diary';
  type: 'committed';
} | {
  source: 'diary';
  type: 'single';
  id: string;
};

export type UserTaskDb = UserTask & {
  audit: UserTaskAudit<UserTaskDb>[];
  relationships: TaskRelationshipBase<string>;
};
