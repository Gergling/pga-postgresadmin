import { analyseLanguage } from "@main/features/ai";
import { fetchStagedFileContents } from "@main/features/projects/commands";
import { fetchProjectsInstructionsDoc } from "@main/features/projects/llm";
// import {
//   // generateCommitMessage,
//   generateCommitMessageText,
// } from "@main/features/projects/rituals/commit-staged"
import { PROJECT_ROOT } from "@main/shared/file";
import { log } from "@main/shared/logging";
import {
  CommitMessage,
  CONVENTIONAL_COMMIT_MESSAGE_SCHEMA
} from "@shared/features/projects";

const responseJsonSchema = CONVENTIONAL_COMMIT_MESSAGE_SCHEMA.toJSONSchema();

const main = async () => {
  log('Starting commit message generator', 'success');
  console.info('Response JSON Schema:', responseJsonSchema)
  const project = { name: 'postgresadmin', path: PROJECT_ROOT };
  const commitMessageInstructions = await fetchProjectsInstructionsDoc(
    'commit-message'
  );
  log('Fetching staged files', 'info')
  const stagedFiles = await fetchStagedFileContents(project.path);
  log('Fetching Gemini response', 'info')

  // Gemini 3.1 Pro	Complex refactors & large diffs
  // Gemini 3.1 Flash	Everyday commits & speed
  // Gemma 4 (Open)	Local/On-device analysis
  // Anything where the supported actions include generateContent
  const {
    response,
    text
  } = await analyseLanguage<CommitMessage>(
    [
      commitMessageInstructions,
      'Here are the staged files:',
      ...stagedFiles,
    ].join('\n\n'),
    () => { /** This will run on every retry */},
    { zodSchema: CONVENTIONAL_COMMIT_MESSAGE_SCHEMA }
  );

  console.log('DATA OUTPUT')
  console.log(response.data)
  console.log('TEXT OUTPUT')
  console.log(text)
  if (response.text) {
    console.log('TEXT OUTPUT PARSED')
    console.log(JSON.parse(response.text))
  }
  if (response.candidates) {
    console.log('CANDIDATES OUTPUT')
    console.log(response.candidates[0])
  }
}

main();
