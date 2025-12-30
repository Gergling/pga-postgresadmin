import { readFileSync } from 'fs';
import { EmailFragment } from '../../../shared/email/types';

const prompt = [
  readFileSync('./src/main/llm/librarian/prompt.md', 'utf-8'),
  'The output format should be JSON based on the following typescript format:',
  [
    "```typescript\n",
    readFileSync('./src/main/llm/librarian/types/prompt.ts', 'utf-8'),
    "```\n"
  ],
  'The email fragments are as follows:',
];

const simplifyFragment = ({
  body, receivedAt, from, id, subject
}: EmailFragment) => ({
  body: body.substring(0, 2000),
  from, id, subject,
  receivedAt: receivedAt.toString(),
});

export const buildTriagePrompt = (fragments: EmailFragment[]) => {
  const simplifiedFragments = fragments.map(simplifyFragment);
  const simplifiedFragmentJson = JSON.stringify(simplifiedFragments, null, 2);
  return [
    `The current date/time is: ${new Date().toISOString()}`,
    ...prompt,
    simplifiedFragmentJson,
  ].join('\n');
};
