import {
  LanguageModelHistoryBase,
  SerialisedModelSummary,
  SerialisedModelSummaryValues
} from "../../schema";
import { getModelGroupValues } from "./summary";
import { reduceLlmHistory } from "../reducers";
import { compareLlmModelFactory } from "./comparators";

export class ModelGroup {
  data: LanguageModelHistoryBase[];

  // Keys.
  model: string;
  source: string;

  // Values.
  values: SerialisedModelSummaryValues;

  private updateValues() {
    const report = this.data.reduce(
      reduceLlmHistory,
      { failureCount: 0, retryableCount: 0, successfulRuntimes: [] }
    );
    this.values = getModelGroupValues(report);
    return this;
  }

  constructor({ model, source }: { model: string, source: string }) {
    this.model = model;
    this.source = source;
    this.data = [];
    this.updateValues();
  }

  add(record: LanguageModelHistoryBase) {
    this.data.push(record);
    this.updateValues();
    return this;
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
    const comparator = compareLlmModelFactory(stable);

    const comparison = comparator(subject.serialised, this.serialised);

    if (comparison < 0) return subject;

    return this;
  }
  get selectCleanupModels(): LanguageModelHistoryBase[] {
    return this.data.sort((a, b) => b.timestamp - a.timestamp).slice(100);
  }

};
