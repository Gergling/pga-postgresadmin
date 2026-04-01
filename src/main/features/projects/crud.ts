import { readdir } from 'fs/promises';
import path from 'path';
import { FetchItemFunction, FetchListFunction } from '@shared/lib/typesaurus';
import { getEnvVar } from '@main/env';
import { fetchProjectDoc, Project } from '@shared/features/projects';
import { fetchLatestCommitDate, fetchStagedFileContents, fetchStagedFileList, runGitCommit } from './commands';
import { getLlmInstructions } from '@shared/features/llm';
import { analyseLanguage } from '../ai';

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

const fetchProjectStagedFiles = async (folderPath: string) => {
  try {
    const stagedFiles = await fetchStagedFileList(folderPath);
    const latestCommitDate = await fetchLatestCommitDate(folderPath)
    return {
      latestCommitDate: latestCommitDate.getTime(),
      staged: stagedFiles.length
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
  Project, string
> = async ({ path }) => {
  try {
    console.log('fetching commit message for staged files at:', path)
    const commitMessageInstructions = await fetchProjectDoc('generate-commit-message') ?? '';
    console.log('commit message instructions:', commitMessageInstructions);
    const stagedFiles = await fetchStagedFileContents(path);
    console.log('staged file contents:', stagedFiles);
    const prompt = getLlmInstructions([
      commitMessageInstructions,
      'Here are the staged files:',
      ...stagedFiles,
    ]);
    console.log('prompt:', prompt)
    const suggestedCommitMessage = await analyseLanguage(prompt);
    return suggestedCommitMessage;
  } catch (e) {
    throw new Error(e);
  }
};

export const commitProjectStagedFiles = async (
  project: Project,
  message: string
): Promise<{
  stdout: string; stderr: string;
}> => runGitCommit(project.path, message);
