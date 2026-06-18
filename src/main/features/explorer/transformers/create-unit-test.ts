import path from 'node:path';
import { readFile, readFileSync, writeFile } from 'node:fs';
import { promisify } from 'node:util';
import task from 'tasuku';
import { Observer } from '@trpc/server/observable';
import {
  LanguageModelOrchestrationUpdateProps,
  transformMarkdown
} from '@/main/shared';
import { runLanguageModel } from '@/main/features/ai';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

const unitTestingDocContent = readFileSync(
  path.resolve(`docs/llm/unit-tests.md`), 'utf-8'
);

export type GenerateUnitTestUpdateProps = LanguageModelOrchestrationUpdateProps<string> & {
  message?: string;
  path: string;
};
type GenerateUnitTestUpdateEmitter = Observer<
  GenerateUnitTestUpdateProps, GenerateUnitTestUpdateProps
>;

const generateUnitTest = async (
  path: string, testFilePath: string, prompt: string,
  emit: GenerateUnitTestUpdateEmitter
): Promise<void> => {
  // TODO: Might want to prioritise models/gemini-2.5-pro or
  // skip models/gemini-2.5-flash
  const { state } = await task(
    'Generate unit test', async ({ setError, task }) => {
      try {
        await runLanguageModel<string>(
          prompt, task, (props) => {
            const emission = { ...props, path };

            // If it's failed, it won't try again for whatever reason.
            if (props.payload.status === 'failed') return emit.error(emission);

            // On success, we can still put the commit message in a variable and
            // return it, awful and messy as it is. It's a question of whether
            // that's worth doing.

            emit.next(emission);

            if (props.payload.status === 'success') {
              const cleanedResponse = transformMarkdown(props.payload.response);

              writeFileAsync(testFilePath, cleanedResponse)
                .then(emit.complete)
                .catch((e) => {
                  setError(e);
                  emit.error({
                    ...emission, message: 'Failed to write test file.'
                  });
                })
              ;
            }
          }
        );
      } catch (e) {
        const error = e instanceof Error
          ? e
          : new Error('An unknown error occurred.');
        setError(error);
        throw error;
      }
    }
  );

  if (state === 'success') return emit.complete();
};

export const emitUnitTest = async ({ sourceFilePath, emit }: {
  sourceFilePath: string; emit: GenerateUnitTestUpdateEmitter;
}) => {
  try {
    const ext = path.extname(sourceFilePath);
    const testFilePath = sourceFilePath.replace(new RegExp(`\\${ext}$`), `.test${ext}`);
  
    const sourceFileContents = await readFileAsync(sourceFilePath, 'utf-8');
    const prompt = [
      `Here is the contents of the source file \`${sourceFilePath}\`:`,
      '```ts',
      sourceFileContents,
      '```',
      unitTestingDocContent,
      `Generate tests for ${sourceFilePath} in ${testFilePath} according to the
      testing guidelines. The code will be put straight into a .ts file.`
    ].join('\n');
  
    await generateUnitTest(sourceFilePath, testFilePath, prompt, emit);
  } catch (e) {
    console.error('Error in emitUnitTest', e);
    throw e;
  }
};
