import { EmailFragment, EmailFragmentStatus } from "../../../shared/email/types";
import { getFirebaseDb } from "../../libs/firebase";
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
  const batch = getFirebaseDb().batch();

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

// TODO: Consider a generic function for wrapping these functions.
// Direct instructions would work the same way, so...
export const triageNewEmailFragments = async (): Promise<TriageTasksResponse> => {
  try {
    // Email functions: take emails, simplify, return any object.
    const fragments = await fetchInboxFragments();
    const simplifiedFragments = fragments.map(simplifyFragment);

    // Generic function: Takes object, makes JSON string.
    const simplifiedFragmentJson = JSON.stringify(simplifiedFragments, null, 2);
    // TODO: Consider another emit here, just for status update on email triage.
    // This can be in the generic function based on the TaskSource type property.

    // Email functions: Update email status and emit changes.
    // The return from the fetch can be the right type to put in here.
    const processing = await updateProcessingFragments(fragments);
    emit("Librarian is triaging emails.", processing);

    // Generic: Takes source variable and JSON string.
    const analysis = await generateTaskContent('email', simplifiedFragmentJson);

    // Generic: We can pass in the relevant batch update function like we've done here.
    await generateProposedTasks(analysis, batchUpdateFactory(fragments));

    // Generic: We should pass in success/failure message callbacks (fed the
    // appropriate type), but otherwise this is fine.
    return { message: `Updated ${processing.length} entries.`, source, status: 'success' };
  } catch (error) {
    console.error("Librarian Triage Failed:", error);
    return { message: error.message || error, source, status: 'error' };
  }
};
