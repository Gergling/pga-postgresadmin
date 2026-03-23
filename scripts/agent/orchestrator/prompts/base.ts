import { OrchestratorAgentDomain } from "../types";
import { getFileContents } from "../utilities";

const getPrompt = (lines: string[]) => lines.join('\n');

const getDomainDocumentName = (domain: OrchestratorAgentDomain) => {
  switch (domain) {
    case 'commit-messages':
      return 'commit-messages';
    case 'unit-tests':
      return 'unit-tests';
    default:
      throw new Error(`Unknown domain: ${domain}`);
  }
}

const getDomainDocumentContent = (
  domain: OrchestratorAgentDomain
) => getFileContents(`docs/llm/${getDomainDocumentName(domain)}.md`);

export const getPromptBaseForProjectDevelopment = (
  domain: OrchestratorAgentDomain,
  lines: string[]
) => getPrompt([
  getFileContents('docs/project-guidelines.md'),
  getDomainDocumentContent(domain),
  ...lines,
]);
