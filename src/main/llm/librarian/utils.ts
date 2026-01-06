import { EmailFragment } from "../../../shared/email/types";
import { mainFirebaseDb } from "../../libs/firebase";
import { FragmentAnalysisResponse } from './types/prompt';
import { buildTriagePrompt } from "./prompt";
import { analyseLanguage } from "../../features/ai/analyse-language";
import { inboxFragmentCollection } from '../../email/db';
import { createUserTask, userTaskCollection } from "../../features/tasks";
import { validateLanguageModelResponse } from "../shared";
import { fragmentAnalysisResponseSchema } from "./utilities/validation";

const fetchFragments = async () => {
  try {
    const snapshot = await inboxFragmentCollection()
      .where('status', '==', 'new')
      .limit(10) // Small batches to prevent context overflow
      .get();
  
    if (snapshot.empty) return [];
  
    const fragments = snapshot.docs.map(doc => doc.data());
  
    return fragments;
  } catch (error) {
    console.error("Error fetching fragments:", error);
    throw error;
  }
};

const getAnalysis = (responseText: string): FragmentAnalysisResponse => {
  const cleanedJson = responseText.replace(/```json|```/g, "").trim();
  try {
    const response = JSON.parse(cleanedJson);
    const validation = validateLanguageModelResponse(response, fragmentAnalysisResponseSchema);

    if (!validation.success) throw new Error(validation.message);

    const analysis = validation.value;
    return analysis;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw error;
  }
}

const applyAnalysis = async (
  analysis: FragmentAnalysisResponse,
  originalFragments: EmailFragment[]
) => {
  const batch = mainFirebaseDb.batch();

  try {
    // Create suggested tasks
    analysis.suggestedTasks.forEach(({ summary, importance, momentum, reasoning }) => {
      const taskRef = userTaskCollection().doc();
      batch.set(taskRef, createUserTask({
        summary,
        description: reasoning,
        votes: {
          importance: { Librarian: importance },
          momentum: { Librarian: momentum },
        },
        source: 'email',
        // Status is set to proposed by default, and the updated property should also be automatically set.
      }));
    });
  
    // Mark fragments as 'processed'
    originalFragments.forEach(f => {
      const fragRef = inboxFragmentCollection().doc(f.db.id);
      batch.update(fragRef, { status: 'processed', triagedAt: Date.now() });
    });
  
    await batch.commit();
  } catch (error) {
    console.error("Error applying analysis:", error);
    throw error;
  }
}

export const triageNewFragments = async () => {
  try {
    // 1. Get unprocessed fragments
    const fragments = await fetchFragments();

    // 2. Prepare the prompt (We will refine the actual string next)
    const prompt = buildTriagePrompt(fragments);

    // 3. Get AI Analysis
    const result = await analyseLanguage(prompt);
    const analysis = getAnalysis(result);

    // 4. Execute the results (Create tasks, update profiles)
    await applyAnalysis(analysis, fragments);

    return { processed: fragments.length, tasksCreated: analysis.suggestedTasks.length };

  } catch (error) {
    console.error("Librarian Triage Failed:", error);
    throw error;
  }
}
