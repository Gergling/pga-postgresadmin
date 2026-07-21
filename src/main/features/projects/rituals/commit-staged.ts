import task from 'tasuku';
import { runLanguageModel } from '@/main/features/ai';
import {
  CONVENTIONAL_COMMIT_MESSAGE_SCHEMA, Project
} from "@/shared/features/projects";
import { GenerateCommitMessageUpdateEmitter } from "../types";
import { LogApi } from "@/main/shared";

export const generateCommitMessage = async (
  project: Project, prompt: string, emit: GenerateCommitMessageUpdateEmitter,
  logApi: LogApi
): Promise<void> => {
  // TODO: Might want to prioritise models/gemini-2.5-pro or
  // skip models/gemini-2.5-flash
  const { state } = await task(
    'Generate commit message', async ({ setError, task }) => {
      try {
        await runLanguageModel(
          prompt, task, (props) => {
            const emission = { ...props, project };

            // If it's failed, it won't try again for whatever reason.
            if (props.payload.status === 'failed') return emit.error(emission);

            // On success, we can still put the commit message in a variable and
            // return it, awful and messy as it is. It's a question of whether
            // that's worth doing.

            emit.next(emission);

            if (props.payload.status === 'success') emit.complete();
          }, { schema: CONVENTIONAL_COMMIT_MESSAGE_SCHEMA }
        );
      } catch (e) {
        const error = e instanceof Error
          ? e
          : new Error('An unknown error occurred.');
        setError(error);
        throw error;
      }
    }
  );

  if (state === 'success') return emit.complete();
};
