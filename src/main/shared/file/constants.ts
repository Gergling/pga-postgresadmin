import { resolve } from 'node:path';
import { log } from '../logging';

export const PROJECT_ROOT = resolve(__dirname, '../../../../');

log(`PROJECT_ROOT: ${PROJECT_ROOT}`, 'info')
