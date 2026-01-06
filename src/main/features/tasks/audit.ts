import { UserTask, UserTaskAudit } from "../../../shared/features/user-tasks";

export const getUserTaskAudit = (userTask: UserTask): UserTaskAudit => {
  // Omits audit, id and source.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { audit, id, source, ...rest } = userTask;
  return rest;
};
