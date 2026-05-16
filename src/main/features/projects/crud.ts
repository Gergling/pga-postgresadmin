import { readdir } from 'fs/promises';
import path from 'path';
import { FetchItemFunction, FetchListFunction } from '@shared/lib/typesaurus';
import {
  Project
} from '@/shared/features/projects';
import { getLlmInstructions } from '@/shared/features/llm';
import { loadAppSettings, isGitRepository } from '@/main/shared';
import {
  fetchLatestCommitDate,
  fetchStagedFileContents,
  fetchStagedFileList,
  runGitCommit
} from './commands';
import { generateCommitMessage } from './rituals';
import { GenerateCommitMessageUpdateEmitter } from './types';

async function getPersonalFolders() {
  const appSettings = await loadAppSettings();
  const targetPath = appSettings.projects?.path;
  if (!targetPath) return;

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
  const hasRepo = await isGitRepository(folderPath);
  if (!hasRepo) return;

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
  { emit: GenerateCommitMessageUpdateEmitter, project: Project }, void
> = async ({ emit, project }) => {
  const { path } = project;
  try {
    const stagedFiles = await fetchStagedFileContents(path);

    const prompt = getLlmInstructions([
      'Generate a commit message based on the staged files',
      'Here are the staged files:',
      ...stagedFiles,
    ]);

    await generateCommitMessage(
      project, prompt, emit
    );

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
