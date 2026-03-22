import { GEMINI_API_KEY, GEMINI_MODEL } from '@main/libs/google-gen-ai';
import { execSync } from 'node:child_process';

type RunAiderProps = {
  readonly?: string[];
  modifiable?: string[];
};

export const runAider = (
  instructions: string,
  { modifiable, readonly }: RunAiderProps = {
    modifiable: [],
    readonly: [],
  },
) => {
  const readArgs = readonly?.map(f => `--read ${f}`).join(' ');
  const modifyArgs = modifiable?.join(' ');
  
  const cmd = `aider --model gemini/${GEMINI_MODEL} \
    --api-key gemini=${GEMINI_API_KEY} \
    ${readArgs}
    ${modifyArgs}
    -m "${instructions}"`
  ;

  console.info('Running:', cmd);

  const result = execSync(cmd);
  console.info('Aider result:', result.toString());
};

// aider --model gemini/gemini-flash-latest --api-key gemini=AIzaSyB1df8BpWBTTAZ3oU5SxC2CW4wkG9Phajg     --read docs/project-guidelines.md --read docs/llm/10-testing.md --read src/main/features/job-search/utilities/mappers.ts src/main/features/job-search/utilities/mappers.test.ts -m "Generate tests for src/main/features/job-search/utilities/mappers.ts in src/main/features/job-search/utilities/mappers.test.ts according to the testing guidelines."

export const runKnip = () => execSync(
  'knip --files --production --no-exit-code',
  { encoding: 'utf-8' }
).split(/\r?\n/)
  .map(s => s.trim())
  .filter(Boolean);
