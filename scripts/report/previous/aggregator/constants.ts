import {
  AnalyticsGroupLabel,
  OverviewVisibilityStatusLabel,
  VisibilityStatusLabel
} from "./types";

export const ANALYTICS_GROUPS: AnalyticsGroupLabel[] = [
  { name: 'live', label: 'Live' },
  { name: 'coverage', label: 'Coverage' },
  { name: 'lint', label: 'Lint' },
] as const;

export const VISIBILITY_STATUSES: VisibilityStatusLabel[] = [
  { name: 'highlight', label: 'Highlight' },
  { name: 'default', label: 'Default' },
  { name: 'mute', label: 'Mute' },
] as const;

export const OVERVIEW_VISIBILITY_STATUSES: OverviewVisibilityStatusLabel[] = [
  { name: 'highlight', label: 'Highlight' },
  { name: 'default', label: 'Default' },
  { name: 'overview', label: 'Overview' },
  { name: 'mute', label: 'Mute' },
  { name: 'reports', label: 'Reports' },
] as const;

