import util from 'node:util';
import { readFile as readFileNodeFs } from 'node:fs';
import { resolve } from 'node:path';

const readFile = util.promisify(readFileNodeFs);

export const getFileContents = (path: string) => readFile(
  resolve(path), 'utf-8'
);
