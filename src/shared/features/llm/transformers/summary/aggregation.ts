import { getObjectKeys, mean, median } from "@/shared/utilities";
import {
  INITIAL_SUMMARISED_RUNS,
  LanguageModelHistoryBase,
  LlmHistoryRelative,
  LlmHistorySummarisedRuns,
  LlmHistorySummary,
  LlmSummary
} from "../../schema";
import { getModelEfficiency } from "../../utilities";
import { getSummaryClassification } from "./classification";

// type Mapper<I, O> = (params: I) => O;
// type Filter<I> = (params: I) => boolean;
// type Reducer<I, O> = (acc: O, params: I) => O;

// type Params = {
//   mappers: 
// };

// type FncMap<T extends Record<string, () => unknown>> = {
//   [K in keyof T]: ReturnType<T[K]>;
// };

// const transduce = <I, Mappers extends Record<string, () => unknown>>({
//   mappers
// }: {
//   mappers: Mappers
// }): {
//   mapped: FncMap<Mappers>
// } => {
//   return { mapped: {} };
// };

// type Transducer = 
// const transducerLoop = <
//   T, 
//   U extends Record<
//     string, 
//     (props: { item: T, context: C | undefined }) => unknown
//   >,
//   C
// >({ items, fncs, context }: {
//   items: T[], 
//   fncs: U,
//   context?: C
// }) => {
//   return items.reduce((acc, item) => {
//     return getObjectKeys(fncs).reduce((acc, key) => {
//       const fnc = fncs[key];
//       const value = fnc({ item, context });
//       return { ...acc, [key]: value };
//     }, {} as Record<>);
//   }, {});
// };

// const items = [{ piss: 1 }, { off: 2 }];
// const phase1 = transducerLoop({ items, fncs: {
//   filter: ({ item }) => 'piss' in item,
//   map: ({ item }) => ('piss' in item ? {
//     type: 'piss', value: item.piss } : { type: 'off', value: item.off }
//   ),
// }});

export const incrementLlmHistorySummarisedStatus = (
  acc: LlmHistorySummarisedRuns, {
    runtime, status
  }: Pick<LanguageModelHistoryBase, 'runtime' | 'status'>
): LlmHistorySummarisedRuns => {
  if (status === 'success') return {
    ...acc, runtimes: [...acc.runtimes, runtime]
  };
  if (['rate-limitations', 'traffic'].includes(status)) return {
    ...acc,
    retryable: acc.retryable + 1,
  };
  return {
    ...acc,
    failures: acc.failures + 1,
  };
};

const initialiseLlmHistorySummary = (
  params: Pick<LlmHistorySummary, 'source' | 'model' | 'operation'>
): LlmHistorySummary => ({
  ...params,
  runs: INITIAL_SUMMARISED_RUNS,
});

// TODO: Could scale stability by using half the total runs instead of 5.

const summariseLlmHistoryRuns = (
  data: LanguageModelHistoryBase[]
): LlmHistorySummary[] => {
  const summaryMap = new Map<string, LlmHistorySummary>();
  data.forEach((record) => {
    const { model, operation, source } = record;
    const key = `${model}-${operation}-${source}`;
    const summary = summaryMap.get(key) ?? initialiseLlmHistorySummary({ model, operation, source });
    const runs = incrementLlmHistorySummarisedStatus(summary.runs, record);
    summaryMap.set(key, { ...summary, runs });
  });
  return Array.from(summaryMap.values());
};

const enrichLlmHistorySummary = (
  summary: LlmHistorySummary
): LlmHistorySummary => {
  const { runs: { failures, retryable, runtimes } } = summary;
  const successful = runtimes.length;
  const terminal = successful + failures;
  const total = terminal + retryable;
  const aggregation = {
    successful,
    terminal,
    total,
  };

  if (successful === 0) return { ...summary, aggregation };

  const rate = successful / terminal;
  const success = {
    runtimes: {
      mean: mean(runtimes),
      median: median(runtimes),
      min: Math.min(...runtimes),
      max: Math.max(...runtimes),
    }
  };
  const efficiency = getModelEfficiency({
    rate, runtime: success.runtimes
  });

  return {
    ...summary,
    aggregation,
    success: {
      ...success,
      efficiency,
      rate,
    },
  };
};

/**
 * Summarises an array of raw Llm runs down the model/operation granularity.
 * @param data 
 */
export const summariseLlmHistory = (
  data: LanguageModelHistoryBase[]
): LlmHistorySummary[] => {
  // Phase 1: Summarise all runs.
  const summaries = summariseLlmHistoryRuns(data);

  // Phase 2: Enrich.
  return summaries.map(enrichLlmHistorySummary);
};

type LlmAttributes = { local: boolean; };

// Abstracted JIC we expand the number of attributes.
const getLlmAttributeKey = (
  attributes: LlmAttributes
): string => attributes.local ? 'local' : 'remote';

export const summariseLlmRelativeHistory = (
  data: (LlmHistorySummary & Pick<LlmSummary, 'traits'>)[]
): LlmHistoryRelative[] => {
  const {
    demographics, maximumTotalRuns, mostSuccessfulTotalRuns
  } = data.reduce((acc, { traits, aggregation }) => {
    const key = getLlmAttributeKey(traits);
    const mostSuccessfulTotalRuns = Math.max(
      aggregation?.successful ?? 0,
      acc.mostSuccessfulTotalRuns
    );
    const maximumTotalRuns = Math.max(aggregation?.total ?? 0, acc.maximumTotalRuns);
    return {
      ...acc,
      demographics: { ...acc.demographics, [key]: (acc.demographics[key] ?? 0) + 1 },
      mostSuccessfulTotalRuns,
      maximumTotalRuns,
    };
  }, { demographics: {}, mostSuccessfulTotalRuns: 0, maximumTotalRuns: 0 } as {
    demographics: Record<string, number>;
    mostSuccessfulTotalRuns: number;
    maximumTotalRuns: number;
  });

  return data.map((summary): LlmHistoryRelative => {
    const { aggregation } = summary;
    const demographic = getLlmAttributeKey(summary.traits);
    const demographicProportion = demographics[demographic] / data.length;
    const divergence = 1 - demographicProportion;
    const modelRuns = aggregation?.total ?? 0;
    const experience = modelRuns / maximumTotalRuns;
    const successful = aggregation?.successful ?? 0;
    const proportionalSuccess = successful / mostSuccessfulTotalRuns;
    const response = {
      aggregation: { successful: 0, terminal: 0, total: 0 },
      success: {
        efficiency: { infrastucture: 0, ux: 0 },
        rate: 0,
        runtimes: { mean: 0, median: 0, min: 0, max: 0 }
      },
      ...summary,
      relative: {
        divergence,
        experience,
      }
    }

    const classification = getSummaryClassification(
      response, { maximumTotalRuns, proportionalSuccess }
    );
    return {
      ...response,
      classification
    };
  });
};
