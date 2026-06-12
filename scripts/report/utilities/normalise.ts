import { join } from 'node:path';

export const normalisePath = (
  basePath: string
) => (path: string) => path.replace(basePath, path);

export const normalise = (
  ...args: Parameters<typeof join>
) => join(...args).replace(/\\/g, '/');
