// "C:\\Users\\davie\\Projects\\Personal\\grx-gregs-ratings\\src\\features\\surveys\\wrm\\utilities\\scoring.ts": {
//   "path":"C:\\Users\\davie\\Projects\\Personal\\grx-gregs-ratings\\src\\features\\surveys\\wrm\\utilities\\scoring.ts",
//   "all":false,
//   // Number of statements
//   "statementMap":{
//     "1":{"start":{"line":2,"column":0},"end":{"line":2,"column":57}},
//     "2":{"start":{"line":3,"column":0},"end":{"line":3,"column":52}},
//     "5":{"start":{"line":6,"column":0},"end":{"line":6,"column":88}},
//     "125":{"start":{"line":126,"column":0},"end":{"line":126,"column":2}}
//   },
//   // Number of runs
//   "s":{
//     "1":1,
//     "2":1,
//     "5":1,
//     "125":0
//   },
//   "branchMap":{
//     "0":{
//       "type":"branch",
//       "line":6,
//       "loc":{"start":{"line":6,"column":32},"end":{"line":9,"column":27}},
//       "locations":[
//         {"start":{"line":6,"column":32},"end":{"line":9,"column":27}}
//       ]
//     },
//     "1":{
//       "type":"branch",
//       "line":6,
//       "loc":{"start":{"line":6,"column":60},"end":{"line":9,"column":4}},
//       "locations":[{"start":{"line":6,"column":60},"end":{"line":9,"column":4}}]
//     },
//     "2":{
//       "type":"branch",
//       "line":11,
//       "loc":{"start":{"line":11,"column":28},"end":{"line":12,"column":72}},
//       "locations":[{"start":{"line":11,"column":28},"end":{"line":12,"column":72}}]
//     },
//     "3":{"type":"branch","line":12,"loc":{"start":{"line":12,"column":22},"end":{"line":12,"column":70}},"locations":[{"start":{"line":12,"column":22},"end":{"line":12,"column":70}}]},
//     "4":{"type":"branch","line":14,"loc":{"start":{"line":14,"column":28},"end":{"line":19,"column":5}},"locations":[{"start":{"line":14,"column":28},"end":{"line":19,"column":5}}]},
//     "5":{"type":"branch","line":16,"loc":{"start":{"line":16,"column":8},"end":{"line":19,"column":5}},"locations":[{"start":{"line":16,"column":8},"end":{"line":19,"column":5}}]},
//     "31":{"type":"branch","line":99,"loc":{"start":{"line":99,"column":45},"end":{"line":99,"column":93}},"locations":[{"start":{"line":99,"column":45},"end":{"line":99,"column":93}}]},
//     "32":{"type":"branch","line":106,"loc":{"start":{"line":106,"column":25},"end":{"line":114,"column":2}},"locations":[{"start":{"line":106,"column":25},"end":{"line":114,"column":2}}]},
//     "33":{"type":"branch","line":109,"loc":{"start":{"line":109,"column":2},"end":{"line":112,"column":5}},"locations":[{"start":{"line":109,"column":2},"end":{"line":112,"column":5}}]}
//   },
//   "b":{
//     "0":[10],"1":[30],"2":[36],"3":[61],"4":[7],"5":[25],
//     "31":[6],"32":[9],"33":[32]
//   },
//   "fnMap":{
//     "0":{
//      "name":"getInitialScores",
//      "decl":{"start":{"line":6,"column":32},"end":{"line":9,"column":27}},
//      "loc":{"start":{"line":6,"column":32},"end":{"line":9,"column":27}},
//      "line":6
//     },
//     "1":{"name":"getArchetypeByScore","decl":{"start":{"line":11,"column":28},"end":{"line":12,"column":72}},"loc":{"start":{"line":11,"column":28},"end":{"line":12,"column":72}},"line":11},
//     "2":{"name":"getSortedArchetypes","decl":{"start":{"line":14,"column":28},"end":{"line":19,"column":5}},"loc":{"start":{"line":14,"column":28},"end":{"line":19,"column":5}},"line":14},
//     "3":{"name":"getHighestScoringArchetype","decl":{"start":{"line":21,"column":42},"end":{"line":26,"column":2}},"loc":{"start":{"line":21,"column":42},"end":{"line":26,"column":2}},"line":21},
//     "4":{"name":"getScoringCategory","decl":{"start":{"line":28,"column":34},"end":{"line":77,"column":2}},"loc":{"start":{"line":28,"column":34},"end":{"line":77,"column":2}},"line":28},
//     "5":{"name":"getAdaptiveOmittedArchetype","decl":{"start":{"line":81,"column":43},"end":{"line":104,"column":2}},"loc":{"start":{"line":81,"column":43},"end":{"line":104,"column":2}},"line":81},
//     "6":{"name":"getScores","decl":{"start":{"line":106,"column":25},"end":{"line":114,"column":2}},"loc":{"start":{"line":106,"column":25},"end":{"line":114,"column":2}},"line":106},
//     "7":{"name":"getArchetype","decl":{"start":{"line":116,"column":28},"end":{"line":126,"column":2}},"loc":{"start":{"line":116,"column":28},"end":{"line":126,"column":2}},"line":116}
//   },
//   "f":{"0":10,"1":36,"2":7,"3":7,"4":21,"5":8,"6":9,"7":0}
// }

import { AggregationStatus, GetStatusScore, NormalisedReport, ReportAggregatorNormaliser, VisibilityStatus } from '../aggregator/types';
import { normalizeAndRelativizePath } from '../aggregator/utilities/path';

// const AGGREGATION_NAME = 'code-coverage';

type CharacterLocation = {
  line: number;
  column: number;
};

type StatementLocation = {
  start: CharacterLocation;
  end: CharacterLocation;
};

type BranchCoverage = {
  type: string;
  line: number;
  loc: StatementLocation;
  locations: StatementLocation[];
};

type FunctionCoverage = {
  name: string;
  decl: StatementLocation;
  loc: StatementLocation;
  line: number;
};

type CoverageFileProps = {
  path: string;
  all: boolean;
  statementMap: {
    [statementNumber: string]: StatementLocation;
  };
  s: {
    [statementNumber: string]: number;
  };
  branchMap: {
    [branchNumber: string]: BranchCoverage;
  };
  b: {
    [branchNumber: string]: number[];
  };
  fnMap: {
    [functionNumber: string]: FunctionCoverage;
  };
  f: {
    [functionNumber: string]: number;
  };
};

type CoverageKey = 'branch' | 'fn' | 'statement';
type LineCoverageMap = {
  line: number;
} & {
  [K in CoverageKey]: string | undefined;
};

const defaultLineCoverageMap: Omit<LineCoverageMap, 'line'> = {
  branch: undefined,
  fn: undefined,
  statement: undefined,
};

type LineEntryProps = StatementLocation | BranchCoverage | FunctionCoverage;

const getCoverageEntryLine = (props: LineEntryProps) => {
  if ('line' in props) return props.line;

  return props.start.line;
};
const getCoverageEntryType = (props: LineEntryProps): CoverageKey => {
  if ('type' in props) return 'branch';
  if ('name' in props) return 'fn';

  return 'statement';
};

const reduceLineEntry = (
  map: LineCoverageMap[],
  entry: [string, LineEntryProps],
): LineCoverageMap[] => {
  const [mappingKey, value] = entry;

  const line = getCoverageEntryLine(value);
  const key = getCoverageEntryType(value);

  map[line] = {
    ...defaultLineCoverageMap,
    ...map[line],
    line,
    [key]: mappingKey,
  };
  return map;
};

const isSufficientlyExecuted = (executions: number | number[]) => {
  if (Array.isArray(executions)) return executions.every(e => e > 0);

  return executions > 0;
}

const normaliseFileCoverageReportLines = <AggregationName extends string>(
  fileData: CoverageFileProps,
  getStatusScore: GetStatusScore<AggregationName>
): AggregationStatus<AggregationName>[] => {
  // Grab all the executions by line number against statements, branches and functions.
  // First grab a union map.
  const map = ['branchMap', 'fnMap', 'statementMap'].reduce<LineCoverageMap[]>((map, key) => {
    const obj = fileData[key as keyof Pick<CoverageFileProps, 'branchMap' | 'fnMap' | 'statementMap'>];
    return Object.entries(obj).reduce<LineCoverageMap[]>(reduceLineEntry, map);
  }, []);

  // Then score by execution types.
  const lineCoverageScores = map.map(({ branch, fn, statement }) => {
    const typeExecutionStates = [
      branch !== undefined ? isSufficientlyExecuted(fileData.b[branch]) : false,
      fn !== undefined ? isSufficientlyExecuted(fileData.f[fn]) : false,
      statement !== undefined ? isSufficientlyExecuted(fileData.s[statement]) : false,
    ];

    const typeExecutionsOnly = typeExecutionStates.filter(Boolean);

    const score = typeExecutionsOnly.length / typeExecutionStates.length;

    return getStatusScore(score);
  });

  return lineCoverageScores;
};

export type VisibilityStatusCallback = (filePath: string) => VisibilityStatus;

type CoverageProps = {
  [path: string]: CoverageFileProps;
};

/**
 * Normalizes a hypothetical code coverage report into the NormalisedReport format.
 *
 * @param coverageReport The JSON object from a code coverage tool.
 * @returns A NormalisedReport object based on the coverage data.
 */
export const normaliseCoverageReportFactory = <T extends string>(
  coverageReport: CoverageProps,
  getVisibilityStatus: VisibilityStatusCallback = () => 'default',
): ReportAggregatorNormaliser<T> => (
  {
    getStatusScore,
    getNormalisedVisibility,
  }
): NormalisedReport<T> => {
  return Object.entries(coverageReport).reduce<NormalisedReport>(
    (report, [filePath, data]) => {
      const src = normalizeAndRelativizePath(filePath);
      const visibilityStatus = getVisibilityStatus(src);
      const visibility = getNormalisedVisibility(visibilityStatus);
      const lines = normaliseFileCoverageReportLines(data, getStatusScore);
      return {
        ...report,
        [src]: {
          src,
          visibility,
          lines,
        },
      };
    }, {}
  );
};
