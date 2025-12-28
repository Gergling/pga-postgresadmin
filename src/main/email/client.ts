import { getEnvVar } from '../env';
import * as dotenv from 'dotenv';
import { ImapFlow } from "imapflow";

dotenv.config();

export const instantiateClient = () => new ImapFlow({
  host: getEnvVar('IMAP_HOST'),
  port: parseInt(process.env.IMAP_PORT || '993'),
  secure: true,
  auth: {
    user: getEnvVar('IMAP_USER'),
    pass: getEnvVar('IMAP_PASS'),
  },
  logger: false
});
