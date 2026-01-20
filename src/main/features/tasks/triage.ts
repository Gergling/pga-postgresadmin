// Create tasks from things like diary entries, email fragments and direct instructions using a language model.
import { triageCommittedDiaryEntries } from "../diary/triage";
// import { triageEmailTasks } from "../scheduler/email-task-triage";
import { TriageTasksParameters, TriageTasksResponse } from "./types";

export const triageTasks = async ({ source, type }: TriageTasksParameters): Promise<TriageTasksResponse> => {
  // if (source === 'email') return triageEmailTasks();
  // if (source === 'instructions') return { source, status: 'success', message: 'Instructions triage not implemented.' };
  if (source === 'diary') {
    if (type === 'committed') return triageCommittedDiaryEntries();
    if (type === 'single') return { source, status: 'success', message: 'Diary entry triage not implemented.' };
    return { source, status: 'error', message: `No triage implementation for source: '${source}' and type: '${type}'.` };
  }

  return { source, status: 'error', message: `No triage implementation for '${source}'.` };
};
