import { mean, median } from "@/shared/utilities";
import {
  LanguageModelHistoryBase,
  SerialisedModelSummary,
  SerialisedOperationSummary,
  serialisedOperationSummarySchema
} from "../schema";
import { getModelEfficiency } from "../utilities";
import {
  compareLlmModelsForExperimentation,
  compareLlmModelsForStability,
  getModelActionClassification
} from "./utilities";
import { reduceLlmHistory } from "./reducers";

class ModelGroup {
  data: LanguageModelHistoryBase[];

  // Keys.
  model: string;
  source: string;

  // Values.
  cache?: Omit<SerialisedModelSummary, 'name' | 'source'>;

  constructor({ model, source }: { model: string, source: string }) {
    this.model = model;
    this.source = source;
    this.data = [];
  }

  add(record: LanguageModelHistoryBase) {
    this.data.push(record);
    this.cache = undefined;
    return this;
  }

  get values() {
    if (!this.cache) {
      const {
        failureCount, retryableCount, successfulRuntimes
      } = this.data.reduce(
        reduceLlmHistory,
        { failureCount: 0, retryableCount: 0, successfulRuntimes: [] }
      );

      const successCount = successfulRuntimes.length;
      // Perhaps include different types of count.
      const count = successCount + failureCount;
      const rate = successCount / count;
      const classification = getModelActionClassification({
        failureCount, retryableCount, successCount
      });
      const runtime = {
        mean: mean(successfulRuntimes),
        median: median(successfulRuntimes),
      }
      const efficiency = getModelEfficiency({
        rate, runtime
      });
      this.cache = {
        classification,
        count,
        efficiency,
        rate,
        runtime,
      };
    }
    return this.cache;
  }

  get serialised(): SerialisedModelSummary {
    return {
      ...this.values,
      name: this.model,
      source: this.source,
    };
  }

  get hasSuccessfulRuns(): boolean {
    return [
      'potential', 'stable'
    ].includes(this.values.classification);
  }
  selectModel(subject: ModelGroup, stable: boolean): ModelGroup {
    const comparator = stable
      ? compareLlmModelsForStability
      : compareLlmModelsForExperimentation
      ;

    const comparison = comparator(subject.serialised, this.serialised);

    if (comparison < 0) return subject;

    return this;
  }
  get selectCleanupModels(): LanguageModelHistoryBase[] {
    return this.data.sort((a, b) => b.timestamp - a.timestamp).slice(100);
  }

};
export class OperationGroup {
  groupedByModel: Map<string, ModelGroup>;

  // Keys.
  name: string;

  // Values.
  cache?: {
    experimental: ModelGroup;
    stable: ModelGroup;
  };

  constructor(item: LanguageModelHistoryBase) {
    this.name = item.operation;
    this.groupedByModel = new Map<string, ModelGroup>();
    this.add(item);
  }

  add(record: LanguageModelHistoryBase) {
    const { model, source } = record;
    const modelKey = `${source}-${model}`;
    const modelGroup: ModelGroup = this.groupedByModel.get(
      modelKey
    ) ?? new ModelGroup(record);

    modelGroup.add(record);
    this.groupedByModel.set(modelKey, modelGroup);
    this.cache = undefined;

    return this;
  }

  get values() {
    if (this.cache === undefined) {
      const result = this.groupedByModel.values().next();
      if (result.done) throw new Error(`No model groups for ${this.name}`);
      const { value: first } = result;

      console.log('operation values models')
      const { experimental, stable } = [...this.groupedByModel.entries()].reduce((acc, [key, modelGroup]) => {
        console.log('candidate', modelGroup.source, modelGroup.model, modelGroup.values)
        console.log('current experimental', acc.experimental.source, acc.experimental.model, acc.experimental.values)
        console.log('current stable', acc.stable.source, acc.stable.model, acc.stable.values)

        const experimental = modelGroup.selectModel(acc.experimental, false);
        const stable = modelGroup.selectModel(acc.stable, true);

        console.log('chosen experimental', experimental.source, experimental.model, experimental.values)
        console.log('chosen stable', stable.source, stable.model, stable.values)

        return { experimental, stable };
      }, { experimental: first, stable: first });

      this.cache = {
        experimental,
        stable,
      };
    }
    return this.cache;
  }

  get serialised(): SerialisedOperationSummary {
    const { experimental, stable } = this.values;

    return {
      experimental: experimental.serialised,
      name: this.name,
      stable: stable.serialised,
    };
  }
};

class OperationSummary {
  data: SerialisedOperationSummary;
  constructor(dto: SerialisedOperationSummary) {
    this.data = dto;
  }
  static from(data: unknown[]): OperationSummary[];
  static from(data: unknown): OperationSummary;
  static from(data: unknown | unknown[]) {
    if (Array.isArray(data)) {
      return data.map((dto) => OperationSummary.from(dto));
    }
    const parsed = serialisedOperationSummarySchema.parse(data);
    return new OperationSummary(parsed);
  }
}

/**
 * @deprecated
 */
export type LanguageModelLeading = {
  chosen: ModelGroup;
  experimental: ModelGroup | undefined;
  name: string;
  stable: ModelGroup | undefined;
};
