import { syncEmails } from "../email/sync";
import { triageNewEmailFragments } from "../email/triage";
import { TriageTasksResponse } from "../tasks";

export const triageEmailTasks = async (): Promise<TriageTasksResponse> => {
  const source = 'email';
  const syncReport = await syncEmails();
  if (syncReport.status === 'email') return { source, status: 'error', message: syncReport.data };

  return triageNewEmailFragments();
};
