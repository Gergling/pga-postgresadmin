import {
  LanguageModelHistoryBase,
  SerialisedOperationSummary,
  serialisedOperationSummarySchema
} from "../schema";
import { ModelGroup } from "./model";

export class OperationGroup {
  groupedByModel: Map<string, ModelGroup>;

  // Keys.
  name: string;

  // Values.
  cache?: {
    experimental: ModelGroup;
    stable: ModelGroup;
  };
  values: {
    experimental: ModelGroup;
    stable: ModelGroup;
  };

  constructor(item: LanguageModelHistoryBase) {
    this.name = item.operation;
    this.groupedByModel = new Map<string, ModelGroup>();
    this.add(item);
  }

  private updateValues() {
    const result = this.groupedByModel.values().next();
    if (result.done) throw new Error(`No model groups for ${this.name}`);
    const { value: first } = result;

    const { experimental, stable } = [...this.groupedByModel.entries()].reduce((acc, [key, modelGroup]) => {
      const experimental = modelGroup.selectModel(acc.experimental, false);
      const stable = modelGroup.selectModel(acc.stable, true);

      return { experimental, stable };
    }, { experimental: first, stable: first });

    this.values = {
      experimental,
      stable,
    };
    return this;
  }
  add(record: LanguageModelHistoryBase) {
    const { model, source } = record;
    const modelKey = `${source}-${model}`;
    // New model group is instantiated with the source and model name.
    const modelGroup: ModelGroup = this.groupedByModel.get(
      modelKey
    ) ?? new ModelGroup(record);

    // Model group has history data added.
    modelGroup.add(record);
    this.groupedByModel.set(modelKey, modelGroup);

    this.updateValues();

    return this;
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
