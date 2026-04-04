import util from 'node:util';
import { existsSync, readFile as readFileNodeFs } from 'node:fs';
import path from 'node:path';
import { PROJECT_ROOT } from '@main/shared/file';
import { log } from '@main/shared/logging';

const readFile = util.promisify(readFileNodeFs);

const sharedProjectsPath = path.resolve(
  PROJECT_ROOT, 'src/shared/features/projects',
);

const docNames = ['commit-message'] as const;
type DocProp = typeof docNames[number];

const paths = docNames.reduce((acc, docName) => {
  const md = path.resolve(sharedProjectsPath, 'docs', docName + '.md');
  const type = path.resolve(sharedProjectsPath, 'types', docName + '.ts');
  return {
    ...acc,
    [docName]: { md, type },
  }
}, {} as Record<DocProp, { md: string; type: string; }>);


export const fetchProjectsInstructionsDoc = async (docName: DocProp) => {
  const docPath = paths[docName].md;
  log('Doc path:', 'info')
  log(docPath, 'info')
  const exists = existsSync(docPath);
  log('Exists: ' + (exists ? 'true' : 'false'), 'info')
  if (!exists) return;

  const doc = await readFile(docPath, { encoding: 'utf-8' });

  const propsPath = path.resolve(
    sharedProjectsPath, 'types', docName, '.ts',
  );
  const propsExists = existsSync(propsPath);
  const props = propsExists ? await readFile(propsPath, {
    encoding: 'utf-8'
  }) : '';

  return [doc, props].join('\n\n');
};
