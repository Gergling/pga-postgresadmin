import {
  TaskViewConfigName,
  UiNavigationConfigItem
} from "@/renderer/shared/navigation";
import {
  getNavigationIcon
} from "@/renderer/shared/navigation/components/getNavigationIcon";
import {
  ImportantTasks,
  Placeholder,
  ProposedTasks,
  QuickWins
} from "../svg-viewer/components";

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