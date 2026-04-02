import {
  getRelativeTimeStringNow
} from "@/renderer/shared/common/utilities/relative-time";
import { BreadcrumbNavigationHistoryItem } from "@/renderer/shared/navigation";
import { Project } from "@shared/features/projects";
import { getTemporalZonedDateTime } from "@shared/lib/temporal";
import { ProjectRune } from "./components/Rune";
import { createElement } from "react";
import { PROJECTS_BASE_ROUTE_ABSOLUTE } from "./constants";

export const getProjectStatus = ({ git, path }: Project): {
  git: string;
  gitLatestCommitDate?: string;
  local: string;
} => {
  const local = path ? 'Yes' : 'No';
  if (git === undefined) return { git: 'Unknown', local };
  if (git === false) return { git: 'No', local };
  const zonedDT = getTemporalZonedDateTime(git.latestCommitDate);
  return {
    git: `${git.staged ?? 'No'} staged files`,
    gitLatestCommitDate: getRelativeTimeStringNow(zonedDT),
    local
  };
};

export const getProjectHistoryItem = (
  project: Project,
): BreadcrumbNavigationHistoryItem => ({
  icon: () => createElement(ProjectRune, { project }),
  label: `Project: ${project.name}`,
  path: PROJECTS_BASE_ROUTE_ABSOLUTE + '/' + project.name,
  status: 'success',
});
