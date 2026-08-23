import { mean, median } from "@/shared/utilities";
import {
  LanguageModelHistoryBase,
  ModelClassification,
  SerialisedModelSummary,
  SerialisedOperationSummary,
  serialisedOperationSummarySchema
} from "../schema";
import { compareExperimentalModelActionClassifications, compareModelRuntimes, compareStableModelActionClassifications, getModelActionClassification } from "./utilities";

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
        (acc, { runtime, status }) => {
          if (status === 'success') return {
            ...acc,
            successfulRuntimes: [...acc.successfulRuntimes, runtime],
          };
          if (['rate-limitations', 'traffic'].includes(status)) return {
            ...acc,
            retryableCount: acc.retryableCount + 1,
          };
          return {
            ...acc,
            failureCount: acc.failureCount + 1,
          };
        },
        { failureCount: 0, retryableCount: 0, successfulRuntimes: [] }
      );
      // TODO: isExperimental should apply to *all* statuses which can be
      // considered worth trying the model again, e.g. traffic or rate
      // limitations.
      // "Stable" should be a separate factor and applies to models where there
      // are at least 5 *successful* runs.
      // That way, we can choose the quickest from our "stable" models, and the
      // most records from our "experimental" models. This will always yield a
      // fallback JIC finding a stable model is difficult.
      // Also this *really* should go into an operation table. That way we can
      // run something like a "summariseOperation" each time we've completed
      // (or even failed) a language model run.

      // If a model has run more than 5 times successfully, we'll call it stable.
      const successCount = successfulRuntimes.length;
      const count = successCount + failureCount;
      const rate = successCount / count;
      const classification = getModelActionClassification({
        failureCount, retryableCount, successCount
      });
      this.cache = {
        classification,
        count,
        runtime: {
          mean: mean(successfulRuntimes),
          median: median(successfulRuntimes),
        },
        rate,
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
      ? compareStableModelActionClassifications
      : compareExperimentalModelActionClassifications
      ;

    const comparison = comparator(
      subject.serialised.classification,
      this.serialised.classification
    );
    if (comparison < 0) return subject;

    // If we're comparing two models with the same classification, we'll use
    // the one with the lowest runtime, but only if both models have
    // successful runs.
    if (stable
      && comparison === 0
      && subject.hasSuccessfulRuns
      && this.hasSuccessfulRuns
    ) {
      const comparison = compareModelRuntimes(
        subject.values.runtime.median,
        this.values.runtime.median
      );
      if (comparison < 0) return subject;
    }
    return subject;
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
