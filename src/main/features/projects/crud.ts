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
import { analyseLanguage } from '../ai';
import { parseLanguageModelResponse } from '@main/llm/shared';
import { commitMessageSuggestionResponseSchema, fetchProjectsInstructionsDoc } from './llm';
import {
  handleRitualTelemetry,
  HandleRitualTelemetryProps
} from '../ai/utilities';

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

const handleProjectRitualTelemetry = async <Returns extends Promise<unknown>>(
  project: Project,
  props: HandleRitualTelemetryProps<Returns>
) => handleRitualTelemetry({
  ...props,
  project: {
    name: project.name,
    operation: 'commit-message',
  }
});

const generateCommitMessage = async (
  project: Project, prompt: string
): Promise<CommitMessage> => {
  for (let i = 0; i < 3; i += 1) {
    const languageModelResponse = await handleProjectRitualTelemetry(project, {
      fn: () => analyseLanguage(prompt),
      message: 'Run language model',
      phase: 'analysis',
      retried: i,
    });
    const suggestedCommitMessage = parseLanguageModelResponse(
      languageModelResponse,
      commitMessageSuggestionResponseSchema
    );
    if (suggestedCommitMessage.success) return suggestedCommitMessage.value;
    console.error(suggestedCommitMessage);
  }
  throw new Error('Unable to parse language model response.');
};

export const fetchProjectStagedCommitMessage: FetchItemFunction<
  Project, string
> = async (project) => {
  const { path } = project;
  try {
    const commitMessageInstructions = await handleProjectRitualTelemetry(
      project, {
        fn: () => fetchProjectsInstructionsDoc('commit-message'),
        message: 'Fetching instructions', phase: 'instructions',
      }
    ) ?? '';

    const stagedFiles = await handleProjectRitualTelemetry(project, {
      fn: () => fetchStagedFileContents(path),
      message: 'Fetching staged file contents', phase: 'staged',
    });

    const prompt = getLlmInstructions([
      commitMessageInstructions,
      'Here are the staged files:',
      ...stagedFiles,
    ]);

    const suggestedCommitMessage = await generateCommitMessage(project, prompt);

    return concatenateCommitMessage(suggestedCommitMessage);
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

export const commitProjectStagedFiles = async (
  project: Project,
  message: string
): Promise<{
  stdout: string; stderr: string;
}> => runGitCommit(project.path, message);
