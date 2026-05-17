import { createElement } from "react";
import { Project, ProjectRenderer } from "@/shared/features/projects";
import {
  getRelativeTimeStringNow
} from "@/renderer/shared/common";
import { BreadcrumbNavigationHistoryItem } from "@/renderer/shared/navigation";
import { ProjectRune } from "./components/Rune";
import { PROJECTS_BASE_ROUTE_ABSOLUTE } from "./constants";

export const getProjectStatus = ({ git, path }: ProjectRenderer): {
  git: string;
  gitLatestCommitDate?: string;
  gitLastCheck?: string;
  local: string;
} => {
  const local = path ? 'Yes' : 'No';
  if (git === 'unknown') return { git: 'Unknown', local };
  if (git === 'none') return { git: 'No', local };
  return {
    git: `${git.totalStagedFiles || 'No'} staged files`,
    gitLatestCommitDate: getRelativeTimeStringNow(git.latestCommitDate.zonedDateTime),
    gitLastCheck: getRelativeTimeStringNow(git.lastCheck.zonedDateTime),
    local
  };
};

export const getProjectHistoryItem = (
  project: Pick<Project, 'name'>,
): BreadcrumbNavigationHistoryItem => ({
  icon: () => createElement(ProjectRune, { project }),
  label: `Project: ${project.name}`,
  path: PROJECTS_BASE_ROUTE_ABSOLUTE + '/' + project.name,
  status: 'success',
});
