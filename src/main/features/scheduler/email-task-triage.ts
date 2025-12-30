import { syncEmails } from "../../email/sync";
import { triageNewFragments } from "../../llm/librarian/utils";
import { TriageEmailTasksResponse } from "../../common/types";

export const triageEmailTasks = async (): Promise<TriageEmailTasksResponse> => {
  const syncReport = await syncEmails();
  if (syncReport.status === 'email') return syncReport;

  const { processed, tasksCreated } = await triageNewFragments();

  return { status: 'success', data: `Processed ${processed} fragments, created ${tasksCreated} tasks.` };
};
