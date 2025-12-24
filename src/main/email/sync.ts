import { Temporal } from '@js-temporal/polyfill';
import * as dotenv from 'dotenv';
import { FetchMessageObject, ImapFlow } from 'imapflow';
import { EmailSync } from './types';
import { EmailFragment } from '../../shared/email/types';

dotenv.config();

const instantiateClient = () => new ImapFlow({
  host: process.env.IMAP_HOST,
  port: parseInt(process.env.IMAP_PORT || '993'),
  secure: true,
  auth: {
    user: process.env.IMAP_USER,
    pass: process.env.IMAP_PASS,
  },
  logger: false
});

const getDate1MonthAgo = () => {
  const now = Temporal.Now.plainDateTimeISO();
  console.log('now', now.toString())
  const oneMonthAgo = now.subtract({ months: 1 });
  console.log('previous', oneMonthAgo.toString())

  return oneMonthAgo.toString();
}

const fetchRecentEmailIds = async (client: ImapFlow) => {
  const since = getDate1MonthAgo();
  console.log('since', since)
  const list = await client.search({ since });
  console.log('list', list)
  if (!list || !list.length) return;

  const recentIds = list.slice(-10).reverse();
  return recentIds;
};

const fetchEmail = async (
  client: ImapFlow,
  id: string
) => client.fetchOne(id.toString(), {
  envelope: true, 
  source: true,
  bodyStructure: true 
});

const getPlainDateTime = (date: Date | undefined) => {
  if (!date) return undefined;
  try {
    const instant = Temporal.Instant.from(date.toISOString());
    return instant.toZonedDateTimeISO(Temporal.Now.timeZoneId()).toPlainDateTime();
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const getFragment = (message: FetchMessageObject): EmailFragment | undefined => {
  const { envelope, source } = message;
  const date = getPlainDateTime(envelope?.date);
  if (!date) return;

  const body = source?.toString() || '';
  const subject = envelope?.subject || '';
  const from = envelope?.from?.[0].address || '';

  return { body, date, from, subject };
};

const fetchRecentEmailFragments = async (client: ImapFlow) => {
  const fragments: EmailFragment[] = [];
  const recentIds = await fetchRecentEmailIds(client);
  if (!recentIds) return fragments;

  return Promise.all(recentIds.map(async (id) => {
    const message = await fetchEmail(client, id.toString());
    if (message) {
      const fragment = getFragment(message);
      if (!fragment) throw new Error(`fetchEmail failed for id ${id}`);
      return fragment;
    }

    throw new Error(`fetchEmail failed for id ${id}`);
  }));
};

export const syncEmails = async (): Promise<EmailSync> => {
  const client = instantiateClient();

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    
    const data = await fetchRecentEmailFragments(client);
    
    lock.release();
    await client.logout();
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, message: (err as Error).message };
  }
};
