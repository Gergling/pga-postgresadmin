import { readFileSync } from 'fs';
import { EmailFragment } from '../../../shared/email/types';
import { TASK_IMPORTANCE, TASK_MOMENTUM } from '../../../shared/features/user-tasks';

const prompt = [
  readFileSync('./src/main/llm/librarian/instructions.md', 'utf-8'),
  'The output format should be JSON based on the following typescript format:',
  [
    "```typescript\n",
    readFileSync('./src/main/llm/librarian/types/prompt.ts', 'utf-8'),
    "```\n"
  ].join(''),
  'The importance should be assigned based on the names from this JSON structure:',
  JSON.stringify(TASK_IMPORTANCE),
  'The momentum should be assigned based on the names from this JSON structure:',
  JSON.stringify(TASK_MOMENTUM),
  `If a level of importance or momentum seems unclear, a value of "Awaiting"
  should be assigned and a reason should be provided. Ideally the reason
  should include the information required to clarify the importance or momentum.`,
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
