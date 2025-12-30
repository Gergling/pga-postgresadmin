import { firestore } from 'firebase-admin';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { EmailFragment } from '../../shared/email/types';
import { getPlainDateTimeFromDate } from '../../shared/utilities/temporal';
import { addFirebaseDoc, FirebaseCollectionName, FirebaseEmailFragment } from '../libs/firebase';
import { instantiateClient } from './client';
import { fetchEmail, fetchRecentEmailIds } from './fetch';
import { EmailSync } from './types';

type GmailFragmentError = {
  type: 'fetch' | 'source' | 'body' | 'date-missing' | 'date-formatting';
  id: string;
};

type GmailFragmentResponse =
  | (GmailFragmentError & { success: false; })
  | (EmailFragment & { success: true; })
;

const COLLECTION_NAME: FirebaseCollectionName = 'inbox_fragments';

const createFragmentFactory = (
  client: ImapFlow
) => async (
  gmailId: number
): Promise<GmailFragmentResponse> => {
  const success = false;
  const id = gmailId.toString();
  const message = await fetchEmail(client, id);
  if (!message) return { id, success, type: 'fetch' };

  const { envelope, source } = message;
  if (!source) return { id, success, type: 'source' };

  const parsed = await simpleParser(source);
  const body = parsed.text;
  if (!body) return { id, success, type: 'body' };

  if (!envelope?.date) return { id, success, type: 'date-missing' };

  const subject = envelope?.subject || '';
  const from = envelope?.from?.[0].address || '';
  const fragment: FirebaseEmailFragment = {
    receivedAt: {
      ms: envelope.date.getMilliseconds(),
      db: firestore.Timestamp.fromDate(envelope.date)
    },
    body, from, subject,
    id: id.toString(),
    status: 'new',
    source: 'gmail_important',
  };

  const docRef = await addFirebaseDoc(COLLECTION_NAME, fragment);

  const receivedAt = getPlainDateTimeFromDate(envelope.date);
  if (!receivedAt) return { id, success, type: 'date-formatting' };

  // TODO: If we're sending to the UI, we need to send dates which can be serialised.
  const generalFragment: EmailFragment = {
    ...fragment,
    db: {
      id: docRef.id,
      source: 'firebase',
    },
    receivedAt,
  };
  return { ...generalFragment, success: true };
};

const fetchRecentEmailFragments = async (client: ImapFlow) => {
  const recentIds = await fetchRecentEmailIds(client);
  if (!recentIds) return { rejected: [], resolved: [] };

  const createFragment = createFragmentFactory(client);

  const report = await Promise.all(recentIds.map(createFragment));
  
  return report.reduce<{
    rejected: GmailFragmentError[];
    resolved: EmailFragment[];
  }>(({ rejected, resolved }, fragment) => {
    if (fragment.success) return { rejected, resolved: [...resolved, fragment] };

    return { rejected: [...rejected, fragment], resolved };
  }, { resolved: [], rejected: [] })
};

export const syncEmails = async (): Promise<EmailSync> => {
  const client = instantiateClient();

  try {
    await client.connect();

    const lock = await client.getMailboxLock('INBOX');

    const {
      rejected,
      resolved: data
    } = await fetchRecentEmailFragments(client);
    if (rejected.length) console.error('rejected', rejected);
    
    lock.release();

    await client.logout();
    return { status: 'success', data };
  } catch (err) {
    console.error(err);
    return { status: 'email', data: (err as Error).message };
  }
};
