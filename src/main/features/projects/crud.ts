import { FetchItemFunction } from '@/shared/lib/typesaurus';
import { getLlmInstructions } from '@/shared/features/llm';
import { Project } from '@/shared/features/projects';
import { LogApi } from '@/main/shared';
import {
  fetchStagedFileContents,
  runGitCommit
} from './commands';
import { generateCommitMessage } from './rituals';
import { GenerateCommitMessageUpdateEmitter } from './types';

export const fetchProjectStagedCommitMessage: FetchItemFunction<
  {
    emit: GenerateCommitMessageUpdateEmitter,
    logApi: LogApi,
    project: Project
  }, void
> = async ({ emit, logApi: { log }, project }) => log(
  `Fetching commit message`,
  async (logApi) => {
    const { path } = project;
    try {
      const stagedFiles = await fetchStagedFileContents(path, logApi);

      const prompt = getLlmInstructions([
        'Generate a commit message based on the staged files',
        'Here are the staged files:',
        ...stagedFiles,
      ]);

      await generateCommitMessage(
        project, prompt, emit, logApi
      );

    } catch (e) {
      console.error(e);
      throw new Error('Unable to fetch commit message.');
    }
  }
);

export const commitProjectStagedFiles = async (
  project: Project,
  message: string
): Promise<{
  stdout: string; stderr: string;
}> => runGitCommit(project.path, message);
