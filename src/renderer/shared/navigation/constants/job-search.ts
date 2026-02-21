import { UiNavigationConfigItem } from "../types";
import { InteractionCreation, Interactions, JobSearchDashboard } from "../../../features/job-search";
import { runeFactory } from "../../../features/svg-viewer/components";

export const JOB_SEARCH_VIEW_CONFIG: UiNavigationConfigItem[] = [
  {
    icon: runeFactory('Dashboard', 'blue'),
    index: true,
    label: 'Dashboard',
    omitBreadcrumb: true,
    element: JobSearchDashboard,
    path: '',
  },
  {
    element: () => 'Applications',
    icon: runeFactory('Applications', 'blue'),
    label: 'Applications',
    path: 'applications',
  },
  {
    element: () => 'Contacts',
    icon: runeFactory('Contacts', 'blue'),
    label: 'Contacts',
    path: 'contacts',
  },
  {
    element: () => 'Companies',
    icon: runeFactory('Companies', 'blue'),
    label: 'Companies',
    path: 'companies',
  },
  {
    element: Interactions,
    icon: runeFactory('Interactions', 'blue'),
    label: 'Interactions',
    path: 'interactions',
    children: [
      {
        element: InteractionCreation,
        icon: runeFactory('Log', 'blue'),
        label: 'Log',
        path: 'log',
      },
      {
        path: '*',
        element: () => '404: Interactions',
        omitBreadcrumb: true,
      },
    ],
  },
];
