import * as dotenv from 'dotenv';
import { ImapFlow } from 'imapflow';

dotenv.config();

export const syncEmails = async () => {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT || '993'),
    secure: true,
    auth: {
      user: process.env.IMAP_USER,
      pass: process.env.IMAP_PASS, // Use App Password here!
    },
    logger: false // Set to true if you need to see the raw IMAP stream
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    
    // Fetch last 10 emails
    const messages = [];
    for await (const message of client.fetch('1:10', { envelope: true, source: true })) {
      // Logic to push to Firestore 'inbox_fragments' goes here
      console.log(message)
      messages.push(message.envelope?.subject);
    }

    console.log('emails', messages)
    
    lock.release();
    await client.logout();
    return { success: true, message: `Fetched ${messages.length} emails.` };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};
