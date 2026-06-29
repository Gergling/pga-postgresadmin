import util from 'node:util';
import {
  copyFile as copyFileNodeFs,
  readFile as readFileNodeFs
} from 'node:fs';
import { resolve } from 'node:path';

const copyFile = util.promisify(copyFileNodeFs);
const readFile = util.promisify(readFileNodeFs);

export const readFileContents = (path: string) => readFile(
  resolve(path), 'utf-8'
);

export const copyFileContents = (from: string, to: string) => copyFile(
  resolve(from),
  resolve(to)
);

/**
 * @deprecated Use readFileContents instead.
 */
export const getFileContents = readFileContents;
