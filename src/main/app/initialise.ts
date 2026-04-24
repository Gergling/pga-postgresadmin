import { log } from "@/main/shared/logging";
import { initializeFirebase } from "@/main/libs/firebase";
import { setupHandlers } from "@/main/ipc/setup-handlers";
import { manageEnvironment } from "@/main/environment";
import { crmIpc } from '@/main/features/crm';
import { jobSearchIpc } from '@/main/features/job-search';
import { projectsIpc } from '@main/features/projects/ipc';
import { diaryIpc } from "@main/features/diary/ipc";
import { emailHandlers } from "@/main/features/email";
import { tasksIpc, triageTasks } from '@/main/features/tasks';

export const initialise = () => {
  initializeFirebase();

  log('Setting up IPC handlers...', 'info');
  // TODO: We want to avoid needing all these items pulled into the application.
  // To keep main and renderer separate, this kind of "dependency injection" is
  // necessary.
  // IN THEORY it doesn't stop us from outputting the suitable type.
  // IF WE PUT the handler-compatible functions in here, which we can generate
  // with utilities of various kinds.
  setupHandlers({
    crm: crmIpc,
    // database,
    diary: diaryIpc(),
    // docker: getCommands(),
    environment: manageEnvironment(),
    jobSearch: jobSearchIpc,
    projects: projectsIpc,
    tasks: tasksIpc(),
    triage: {
      ...emailHandlers,
      triageTasks
    }
  });

  log('IPC handlers set up.', 'success');
};
