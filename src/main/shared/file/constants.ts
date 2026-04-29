import { app } from 'electron';

/**
 * @deprecated Can just use `app.getAppPath()` instead. I hadn't realised.
 */
export const PROJECT_ROOT = app.getAppPath();
