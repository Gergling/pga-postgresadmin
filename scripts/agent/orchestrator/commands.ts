import { execSync } from 'node:child_process';

export const runKnip = () => execSync(
  'knip --files --production --no-exit-code',
  { encoding: 'utf-8' }
).split(/\r?\n/)
  .map(s => s.trim())
  .filter(Boolean);
