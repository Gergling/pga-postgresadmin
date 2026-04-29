import { app } from 'electron';
import { resolve } from 'node:path';

export const resolveProjectPath = (
  ...params: string[]
) => resolve(app.getAppPath(), ...params);
