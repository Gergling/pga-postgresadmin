import {
  CommitMessage, CONVENTIONAL_COMMIT_MESSAGE_SCHEMA, Project
} from "@shared/features/projects";
import { handleProjectRitualTelemetry } from "../ritual-telemetry";
import { log } from "@main/shared/logging";
import { parseLanguageModelResponse } from "@main/llm/shared";
import { analyseLanguage } from "../../ai";
import { commitMessageSuggestionResponseSchema } from "../llm";

const responseJsonSchema = CONVENTIONAL_COMMIT_MESSAGE_SCHEMA.toJSONSchema();

// export const generateCommitMessageText = async (
//   project: Project, prompt: string, retried: number
// ) => handleProjectRitualTelemetry(
//   project, 'commit-message', {
//     fn: () => analyseLanguage(prompt, {
//       responseJsonSchema: CONVENTIONAL_COMMIT_MESSAGE_SCHEMA
//     }),
//     message: 'Run language model',
//     phase: 'analysis',
//     retried,
//   }
// );

export const generateCommitMessage = async (
  project: Project, prompt: string
): Promise<CommitMessage> => {
  log('GENERATING COMMIT MESSAGE', 'info')
  /**
   * How to use the language model.
   * We want it to try again when things are busy.
   * We want it to find the next best model.
   * We're "hard-coding" to Gemini for now, since we don't know or care which
   * model we're using.
   * This means we should send a signal to Gemini to get the next model.
   * This means it will respond with models its used.
   * This means we just apply the gemini tried models to the language analysis
   * for now.
   * But we have to send the whole lot because analyse language is the
   * abstraction from Gemini.
   */
  const excludeModels: {
    gemini: string[];
  } = {
    gemini: [],
  };
  for (let i = 0; i < 3; i += 1) {
    const analysis = await handleProjectRitualTelemetry(
      project, 'commit-message', {
        fn: () => analyseLanguage(prompt, {
          responseJsonSchema,
          type: status.type,
        }),
        message: 'Run language model',
        phase: 'analysis',
        retried: i,
      }
    );
    if (analysis.status === 'success') return JSON.parse(analysis.text);
    if (analysis.status === 'traffic') {
      status.tried = [...status.tried, {
        model: analysis.model,
        type: 'gemini',
      }];
    }
    // log('GENERATING COMMIT MESSAGE ATTEMPT:' + i, 'info')
    // const suggestedCommitMessage = parseLanguageModelResponse(
    //   languageModelResponse,
    //   commitMessageSuggestionResponseSchema
    // );
    // log('PARSED:', 'info')
    // console.log(suggestedCommitMessage)
    // if (suggestedCommitMessage.success) return suggestedCommitMessage.value;
    // console.error(suggestedCommitMessage);
  }
  throw new Error('Unable to parse language model response.');
};
