import { OrchestratorAgentDomain } from "../types";

type OrchestratorReportCoverage = {
  hasTestFile: boolean;
  hasTests: boolean;
  // Statements, branches, etc.
};

/**
 * Type for the report JSON format describing the code state. Can include
 * consolidation from other reports, e.g. coverage.
 */
export type OrchestratorReport = {
  // This is just a readable message that appears at the top of the report.
  // It's probably "hard-coded".
  _description: string;
  current: {
    last: {
      ended: number;
      started: number;
      domain?: OrchestratorAgentDomain;
    };
  };
  files: Record<string, {
    importMap: string[];
    // Anything at a by-line level can go in here.
    lines: {
      coverage: OrchestratorReportCoverage;
    }[];
    summary: {
      coverage: OrchestratorReportCoverage;
      lint: {
        /**
         * This is a simple array of circular dependency keys associated with
         * this file.
         */
        circular: string[];
      };
      live: {
        /**
         * Names the *unused* exports in the file.
         */
        exports: number;
      };
      violations: {
        // TODO: Needs a file-level structure.
      };
    };
  }>;
  summary: {
    // Also: highlight/default/overview/mute.
    quality: {
      /**
       * This summarises automated test coverage.
       */
      coverage: OrchestratorReportCoverage;
      /**
       * This summarises anything which could be a "linting" issue, including
       * granular code smells and architectural problems.
       */
      lint: {
        /**
         * Each entry refers to a detected circular dependency.
         * A key is generated from the alphabetical list of unique file names.
         * There is a suggestion for how to fix the circular dependency.
         * It comes with an updated time.
         * During an update with a circular dependency check, entries which do
         * not appear in the check should be removed from the report.
         * This will have a very simple file-level entry.
         */
        circular: Record<string, {
          suggestion: string;
          updated: number;
        }>;
        /**
         * A summary of DRY issues.
         * TODO: Needs a way to check this off as "done".
         * TODO: Needs a way to contain the scale of repeated or similar code
         * blocks.
         * Possibly this is several issues.
         */
        dry: {
          // Probably a simple array.
          // Each array element contains a list of relevant files and a chunk of
          // duplicated code.
          // Will need to ensure language model reports based on larger code chunk
          // similarities.
          // Will need to be a background run due to the number of operations
          // involved.
          // Can cross-check file paths with those given in the rest of the report.
        };
        /**
         * Here we should have a list of apparent violations against the code
         * structure specified in the documentation.
         */
        violations: {
          // TODO: Needs a summary structure.
        };
      };
      /**
       * A summary of live code. files is comparable to meta.total.
       * These numbers refer to the *unused* exports and files, since this is
       * the actionable data.
       */
      live: {
        exports: number;
        files: number;
      };
    };
    process: {
      git: {
        tracked: number;
        dirty: number;
      };
    };
    meta: {
      /**
       * Total number of files.
       */
      total: number;
    };
  };
};
