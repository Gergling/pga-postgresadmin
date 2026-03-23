import { getTsSourceFileContents } from "../utilities";
import { getPromptBaseForProjectDevelopment } from "./base";

export const getPromptToUnitTestUtilities = (
  source: string,
  test: string
) => getPromptBaseForProjectDevelopment('unit-tests', [
  getTsSourceFileContents(source),
  `Generate tests for ${source} in ${test} according to the testing
  guidelines. The code will be put straight into a .ts file.`,
]);
