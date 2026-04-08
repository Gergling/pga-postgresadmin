import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PROJECT_ROOT } from "../file";

export const PROJECT_GUIDELINES_MD = readFileSync(
  resolve(PROJECT_ROOT, 'docs/project-guidelines.md'), 'utf-8'
);
