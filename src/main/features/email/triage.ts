import { EmailFragment, EmailFragmentStatus } from "../../../shared/email/types";
import { mainFirebaseDb } from "../../libs/firebase";
import { emitRitualTelemetry } from "../ai/ipc";
import { generateProposedTasks, generateTaskContent, TriageTasksResponse } from "../tasks";
import { batchEmail, fetchInboxFragments } from "./db";

const source = 'email';

const simplifyFragment = ({
  body, receivedAt, from, id, subject
}: EmailFragment) => ({
  body: body.substring(0, 2000),
  from, id, subject,
  receivedAt: receivedAt.toString(),
});

const emit = (
  message: string,
  fragments: EmailFragment[],
) => {
  emitRitualTelemetry({
    message,
    triage: {
      email: fragments.map(({ id, receivedAt, status }) => ({ id, receivedAt, status })),
    }
  });
}

const getPartialFragments = (
  processing: EmailFragment[],
  success: boolean,
) => {
  const status: EmailFragmentStatus = success ? 'processed' : 'new';
  return processing.map(({ id, receivedAt }) => ({ id, receivedAt, status }));
};

const updateProcessingFragments = async (newFragments: EmailFragment[]) => {
  const processing: EmailFragment[] = newFragments.map((props) => ({ ...props, status: 'processing' }));
  const batch = mainFirebaseDb.batch();

  batchEmail(batch, processing.map(({ id, status }) => ({ id, status })));
  await batch.commit();
  return processing;
};

const batchUpdateFactory = (
  fragments: EmailFragment[],
) => (
  batch: FirebaseFirestore.WriteBatch,
  success: boolean,
) => batchEmail(batch, getPartialFragments(fragments, success));

export const triageNewEmailFragments = async (): Promise<TriageTasksResponse> => {
  try {
    // 1. Get unprocessed fragments
    const fragments = await fetchInboxFragments();
    const simplifiedFragments = fragments.map(simplifyFragment);
    const simplifiedFragmentJson = JSON.stringify(simplifiedFragments, null, 2);

    const processing = await updateProcessingFragments(fragments);
    emit("Librarian is triaging emails.", processing);

    const analysis = await generateTaskContent('email', simplifiedFragmentJson);

    await generateProposedTasks(analysis, batchUpdateFactory(fragments));

    return { message: `Updated ${processing.length} entries.`, source, status: 'success' };
  } catch (error) {
    console.error("Librarian Triage Failed:", error);
    return { message: error.message || error, source, status: 'error' };
  }
};
