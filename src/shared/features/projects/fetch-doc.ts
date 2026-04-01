import util from 'node:util';
import { existsSync, readFile as readFileNodeFs } from 'node:fs';
import path from 'node:path';

const readFile = util.promisify(readFileNodeFs);

type DocProp = 'generate-commit-message';
export const fetchProjectDoc = async (docName: DocProp) => {
  const docPath = path.resolve(__dirname, 'docs', docName);
  const exists = existsSync(docPath);
  if (!exists) return;

  const doc = await readFile(docPath, { encoding: 'utf-8' });
  return doc;
};
