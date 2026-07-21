import { Project } from "@/shared/features/projects";
import { isGitRepository } from "@/main/shared";
import {
  fetchLatestCommitDate,
  fetchStagedFileList
} from "../commands";

export const fetchProjectStagedFiles = async (
  folderPath: string
): Promise<Project['git']> => {
  const hasRepo = await isGitRepository(folderPath);
  if (!hasRepo) return;

  try {
    const stagedFiles = await fetchStagedFileList(folderPath);
    // TODO: Get ALL commit dates for the project.
    // Find the last date as normal.
    // Use the other dates for a transformation that calculates activity level.
    const latestCommitDate = await fetchLatestCommitDate(folderPath)
    return {
      lastCheck: new Date().toISOString(),
      latestCommitDate: latestCommitDate.toISOString(),
      totalStagedFiles: stagedFiles.length
    };
  } catch (e) {
    return;
  }
};
