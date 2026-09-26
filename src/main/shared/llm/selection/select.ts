import { ComparatorFactory } from "@/shared/utilities";
import {
  compareLlmModelFactory,
  LanguageModelProps,
  LlmHistoryRelative,
} from "@/shared/features/llm";
import {
  LanguageModelOrchestrationListFunction,
  LanguageModelSourceLevelConfigResponse,
} from "../types";
import { readLlmOperation } from "../crud";
import { fetchModels } from "../extraction";
import { compareLanguageModels } from "./comparators";

type JoinedLlm = {
  config: LanguageModelProps;
  data?: LlmHistoryRelative;
};

class ModelManager {
  constructor(private models: JoinedLlm[]) { }
  static config(models: LanguageModelProps[]) {
    return new ModelManager(models.map((config) => ({ config })));
  }
  map(models: LlmHistoryRelative[]) {
    const map = new Map<string, LlmHistoryRelative>(models.map((data) => [
      `${data.source}-${data.model}`, data
    ]));
    this.models = this.models.map(
      (model) => ({
        ...model,
        data: map.get(`${model.config.source}-${model.config.name}`)
      })
    );
    return this;
  }
  filterEligible(system: { internetAccess: boolean; }): ModelManager {
    this.models = this.models.filter((m) => {
      if (!m.config.local && !system.internetAccess) return false;
      return true;
    });
    return this;
  }
  sort(criteria: { stable: boolean; }): ModelManager {
    const dataComparator = compareLlmModelFactory(criteria.stable);
    const comparator = ComparatorFactory.instantiate<JoinedLlm>([
      (a, b) => {
        if (!a.data) {
          if (!b.data) return 0;
          return 1;
        }
        if (!b.data) return -1;
        return dataComparator(a.data, b.data)
      },
      (a, b) => compareLanguageModels(a.config, b.config),
    ]);

    this.models = comparator.sort(this.models);
    return this;
  }
  get next(): LanguageModelProps | undefined {
    return this.models[0]?.config;
  }
}

export const fetchNextModelFactory = (
  sources: LanguageModelSourceLevelConfigResponse[]
): LanguageModelOrchestrationListFunction => {
  if (sources.length === 0) throw new Error('No sources provided.');
  return async ({
    attempts,
    excluded,
    logApi, operation, preferred,
  }): Promise<LanguageModelProps | undefined> => {
    // Grab the ideal operation models.
    try {
      // Get all possible models.
      const sourced = await fetchModels({
        excluded, logApi, preferred, sources
      });

      const eligible = ModelManager.config(sourced).filterEligible({
        internetAccess: true
      });

      // If we have run out of models, we simply return.
      if (!eligible.next) return;

      const operationSummary = await readLlmOperation(operation, logApi);

      if (operationSummary) {
        eligible.map(operationSummary.models)
      }

      return eligible.sort({ stable: attempts > 0 }).next;
    } catch (e) {
      // TODO: Might be worth checking for different types of return for
      // different errors. Later.
      return;
    }
  }
};
