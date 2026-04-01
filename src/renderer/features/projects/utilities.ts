import {
  getRelativeTimeStringNow
} from "@/renderer/shared/common/utilities/relative-time";
import { Project } from "@shared/features/projects";
import { getTemporalZonedDateTime } from "@shared/lib/temporal";

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
