import { ImportantTasks, Placeholder, ProposedTasks, QuickWins } from "../../../features/svg-viewer/components";
import { TaskViewConfigName, UiNavigationConfigItem } from "../types";
import { getNavigationIcon } from "../components/getNavigationIcon";

export const TASK_VIEW_CONFIG: UiNavigationConfigItem<TaskViewConfigName>[] = [
  {
    label: 'Proposed Tasks',
    path: 'proposed',
    icon: getNavigationIcon(ProposedTasks),
  },
  {
    label: 'Quick Tasks',
    path: 'quick',
    icon: getNavigationIcon(QuickWins),
  },
  {
    label: 'Important Tasks',
    path: 'important',
    icon: getNavigationIcon(ImportantTasks),
  },
  // {
  //   label: 'Deep Work', // High mass proposal
  //   path: '/deep',
  //   icon: <Engineering />
  // },
  {
    label: 'Abstained',
    path: 'abstained',
    icon: getNavigationIcon(Placeholder),
  },
  {
    label: 'Awaiting Votes',
    path: 'awaiting',
    icon: getNavigationIcon(Placeholder),
  },
];
