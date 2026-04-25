import { readdir } from 'fs/promises';
import path from 'path';
import { FetchItemFunction, FetchListFunction } from '@shared/lib/typesaurus';
import { getEnvVar } from '@main/env';
import {
  CommitMessage,
  Project
} from '@shared/features/projects';
import { fetchLatestCommitDate, fetchStagedFileContents, fetchStagedFileList, runGitCommit } from './commands';
import { getLlmInstructions } from '@shared/features/llm';
import { fetchProjectsInstructionsDoc } from './llm';
import { handleProjectRitualTelemetry } from './ritual-telemetry';
import { RitualTelemetrySubscriptionParamsProjectProps } from '@shared/features/ai';
import { generateCommitMessage } from './rituals';

const targetPath = getEnvVar('VITE_PERSONAL_PROJECTS_PATH');

async function getPersonalFolders() {  
  try {
    const entries = await readdir(targetPath, { withFileTypes: true });
    const folders = entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        name: entry.name,
        path: path.join(targetPath, entry.name),
      }));
      
    return folders;
  } catch (error) {
    console.error("Could not read directory:", error);
  }
}

const fetchProjectStagedFiles = async (folderPath: string): Promise<Project['git']> => {
  try {
    const stagedFiles = await fetchStagedFileList(folderPath);
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

export const fetchProjectList: FetchListFunction<void, Project> = async () => {
  const files = await getPersonalFolders();

  if (!files) throw new Error('No projects found.');

  const projectGitData = await Promise.all(
    files.map(({ path }) => fetchProjectStagedFiles(path))
  );

  const projects = files.map((project, index): Project => ({
    ...project,
    git: projectGitData[index] !== undefined ? projectGitData[index] : false,
  }));

  return projects;
};

export const fetchProjectStagedCommitMessage: FetchItemFunction<
  Project, CommitMessage
> = async (project) => {
  const projectProps: RitualTelemetrySubscriptionParamsProjectProps[
    'operation'
  ] = 'commit-message';
  const { path } = project;
  try {
    const commitMessageInstructions = await handleProjectRitualTelemetry(
      project, projectProps, {
        fn: () => fetchProjectsInstructionsDoc('commit-message'),
        message: 'Fetching instructions', phase: 'instructions',
      }
    ) ?? '';

    const stagedFiles = await handleProjectRitualTelemetry(
      project, projectProps, {
        fn: () => fetchStagedFileContents(path),
        message: 'Fetching staged file contents', phase: 'staged',
      }
    );

    const prompt = getLlmInstructions([
      commitMessageInstructions,
      'Here are the staged files:',
      ...stagedFiles,
    ]);

    const suggestedCommitMessage = await generateCommitMessage(project, prompt);

    return suggestedCommitMessage;
  } catch (e) {
    console.error(e);
    throw new Error('Unable to fetch commit message.');
  }
};

export const commitProjectStagedFiles = async (
  project: Project,
  message: string
): Promise<{
  stdout: string; stderr: string;
}> => runGitCommit(project.path, message);
