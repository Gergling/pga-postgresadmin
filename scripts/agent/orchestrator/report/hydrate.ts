import { hydratorFactory } from "@shared/utilities/initialiser";
import { OrchestratorReport } from "./types";

export const hydrateReport = hydratorFactory<OrchestratorReport>({
  initial: {
    _description: [
      'This is updated in the last run of the report. It is intended as a',
      'time-saver or current cache of the overall code state as updated from',
      'various sources. It should be safe to delete, merely slowing down',
      'orchestration temporarily.'
    ].join(' '),
    current: {
      last: {
        started: 0,
        ended: 0,
      },
    },
    files: {},
    summary: {
      process: {
        git: {
          tracked: 0,
          dirty: 0,
        },
      },
      quality: {
        coverage: {
          hasTestFile: false,
          hasTests: false,
        },
        lint: {
          circular: {},
          dry: {},
          violations: {},
        },
        live: {
          exports: 0,
          files: 0,
        },
      },
      meta: {
        total: 0,
      },
    },
  }
});
