import { EmailFragment } from "../../../shared/email/types";
import { mainFirebaseDb } from "../../libs/firebase";
import { FragmentAnalysisResponse } from './types/prompt';
import { buildTriagePrompt } from "./prompt";
import { analyseLanguage } from "../../features/ai/analyse-language";
import { inboxFragmentCollection } from '../../email/db';

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

const getAnalysis = (responseText: string) => {
  const cleanedJson = responseText.replace(/```json|```/g, "").trim();
  const analysis = JSON.parse(cleanedJson) as FragmentAnalysisResponse;
  return analysis;
}

const applyAnalysis = async (analysis: FragmentAnalysisResponse, originalFragments: EmailFragment[]) => {
  const batch = mainFirebaseDb.batch();

  try {
    // Create suggested tasks
    analysis.suggestedTasks.forEach((task) => {
      const taskRef = mainFirebaseDb.collection('proposed_tasks').doc();
      batch.set(taskRef, {
        ...task,
        status: 'proposed',
        createdAt: Date.now(),
        // TODO: We need to rethink proposed tasks anyway, but these are
        // proposed based on gmail emails so far. This means the ids are
        // legit but potentially useless without the context of being from
        // gmail. That will be what source is for, especially when diary
        // entries become a factor.
        // sourceFragmentIds: originalFragments.map(f => f.id)
      });
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
