import { readFileSync } from 'fs';
import { TASK_IMPORTANCE, TASK_MOMENTUM, TaskSourceType, UserTask } from '../../../../shared/features/user-tasks';
import { analyseLanguage } from '../../ai';
import { validateLanguageModelResponse } from '../../../llm/shared';
import { proposedTaskAnalysisResponseSchema } from './validation';
import { ProposedAnalysisResponse } from './proposed';
import { getFirebaseDb } from '../../../libs/firebase';
import { userTaskCollection } from '../db';
import { createUserTask } from '../utils';

const getInstructionsAbstract = (source: TaskSourceType) => {
  if (source === 'email') return 'Propose new tasks from the following fragments of emails received. Look for explicit or implicit requests.';
  if (source === 'instructions') return 'Propose new tasks from the following instructions.';
  if (source === 'diary') return 'Propose new tasks from the following diary entries.';

  throw new Error(`No instructions implementation for '${source}'.`);
};

const getAnalysisDataContext = (source: TaskSourceType) => {
  if (source === 'email') return 'The email fragments are as follows:';
  if (source === 'instructions') return 'The instructions are as follows:';
  if (source === 'diary') return 'The diary entries are as follows:';

  throw new Error(`No instructions implementation for '${source}'.`);
};

export const buildTriagePrompt = (
  source: TaskSourceType,
  analysisData: string,
) => {
  const instructionsAbstract = getInstructionsAbstract(source);
  const analysisDataContext = getAnalysisDataContext(source);
  return [
    `The current date/time is: ${new Date().toISOString()}`,
    'You are the Librarian of a Personal OS.',
    instructionsAbstract,
    'The output format should be JSON based on the following ProposedAnalysisResponse typescript format:',
    [
      "```typescript\n",
      readFileSync('./src/main/features/tasks/llm/proposed.ts', 'utf-8'),
      "```\n"
    ].join(''),
    'The importance should be assigned based on the names from this JSON structure:',
    JSON.stringify(TASK_IMPORTANCE),
    'The momentum should be assigned based on the names from this JSON structure:',
    JSON.stringify(TASK_MOMENTUM),
    `The ProposedTask['source']['type'] should be set to '${source}'.`,
    `The ProposedTask['source']['id'] should be set to a unique identifier for the material given below.`,
    `If a level of importance or momentum seems unclear, a value of "Awaiting"
    should be assigned and a reason should be provided. Ideally the reason
    should include the information required to clarify the importance or momentum.`,
    analysisDataContext,
    analysisData,
  ].join('\n');
};

export const getPromptAnalysis = (responseText: string): ProposedAnalysisResponse => {
  const cleanedJson = responseText.replace(/```json|```/g, "").trim();
  try {
    const response = JSON.parse(cleanedJson);
    const validation = validateLanguageModelResponse(response, proposedTaskAnalysisResponseSchema);

    if (!validation.success) throw new Error(validation.message);

    const analysis = validation.value;
    return analysis;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw error;
  }
}

export const generateTaskContent = async (
  source: TaskSourceType,
  data: string,
) => {
  const prompt = buildTriagePrompt(source, data);
  const result = await analyseLanguage(prompt);
  return getPromptAnalysis(result);
}

export const generateProposedTasks = async <T>(
  analysis: ProposedAnalysisResponse,
  batchUpdate: (batch: FirebaseFirestore.WriteBatch, success: boolean) => T,
): Promise<{
  batchUpdatedResponse: T;
  tasks: UserTask[];
}> => {
  const batch = getFirebaseDb().batch();

  try {
    // Create suggested tasks
    const tasks = analysis.proposed.map(({ summary, importance, momentum, reasoning, source }) => {
      const taskRef = userTaskCollection().doc();
      const task = createUserTask({
        children: [],
        summary,
        description: reasoning,
        votes: {
          importance: { librarian: importance },
          momentum: { librarian: momentum },
        },
        source,
        timeline: {},
        // Status is set to proposed by default, and the updated property should also be automatically set.
      });

      batch.set(taskRef, task);

      return task;
    });

    const batchUpdatedResponse = batchUpdate(batch, true);

    return { batchUpdatedResponse, tasks };
  } catch (error) {
    console.error("Error applying analysis:", error);
    batchUpdate(batch, false);
    throw error;
  } finally {
    await batch.commit();
  }
}
