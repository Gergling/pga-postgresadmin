import z from "zod";
import { mean, median } from "@/shared/utilities";
import {
  languageModelResponseStatusOptions,
  LanguageModelHistoryBaseStatus,
  languageModelResponseStatus
} from "./response";

export const languageModelHistoryBaseStatusSchema = z.string().transform(
  (value) => {
    if (languageModelResponseStatusOptions.includes(value as LanguageModelHistoryBaseStatus)) {
      return value;
    }
    throw new Error(`Invalid language model response status: ${value}`);
  }
).pipe(languageModelResponseStatus);
const shape = {
  model: z.string(),
  operation: z.string(),
  runtime: z.number(),
  source: z.string(),
  status: languageModelHistoryBaseStatusSchema,
  timestamp: z.number(),
};
export const languageModelHistoryBaseSchema = z.object(shape);
export type LanguageModelHistoryBase = z.infer<
  typeof languageModelHistoryBaseSchema
>;

const runtimeNumericErrorCodes = {
  UNREADABLE_PROPERTY: -1,
  IRRETRIEVABLE_RECORD: -2,
};

const irretrievableRecord: LanguageModelHistoryBase = {
  model: 'RECORD_IRRETRIEVABLE',
  operation: 'RECORD_IRRETRIEVABLE',
  runtime: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
  source: 'RECORD_IRRETRIEVABLE',
  status: 'success',
  timestamp: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
};
const unreadablePropertiesSchema = z.object({
  model: shape.model.default('PROPERTY_UNREADABLE'),
  operation: shape.operation.default('PROPERTY_UNREADABLE'),
  runtime: shape.runtime.default(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
  source: shape.source.default('PROPERTY_UNREADABLE'),
  status: shape.status.default('success'),
  timestamp: shape.timestamp.default(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
});

// const unreadablePropertiesShape = Object.fromEntries<z.ZodType>(Object.entries(shape).map(
//   ([key, zType]) => {
//     switch (zType.type) {
//       case 'number': return [key, zType.catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY)];
//       case 'string': return [key, zType.catch('PROPERTY_UNREADABLE')];
//       default: return [key, zType];
//     }
//   }
// ));
// const unreadablePropertiesSchema = z.object(unreadablePropertiesShape);

const transformUnknownHistoryItem = (value: unknown): LanguageModelHistoryBase => {
  if (typeof value !== 'object' || value === null) return irretrievableRecord;
  // If we don't have a legitimate timestamp, we can set the timestamp to -1.
  // const timestamp = 'timestamp' in value && typeof value.timestamp === 'number' ? value.timestamp : -1;
  return unreadablePropertiesSchema.parse(value);
  // return { ...value, timestamp };
}

export const languageModelHistorySchema = z.unknown().transform(
  transformUnknownHistoryItem
);


class ModelGroup {
  data: LanguageModelHistoryBase[];

  // Keys.
  name: string;

  // Values.
  cache?: {
    count: number;
    isExperimental: boolean;
    mean: number;
    median: number;
  };

  constructor({ name }: { name: string; }) {
    this.name = name;
    this.data = [];
  }

  add(record: LanguageModelHistoryBase) {
    this.data.push(record);
    console.log('should be added', record)
    this.cache = undefined;
    return this;
  }

  get values() {
    console.log('model group values', this.cache, this.data)
    if (!this.cache) {
      const count = this.data.length;
      const runtimes = this.data.map(({ runtime }) => runtime);
      this.cache = {
        count, isExperimental: count < 5,
        mean: mean(runtimes),
        median: median(runtimes),
      };
    }
    return this.cache;
  }
};
export class OperationGroup {
  groupedByModel: Map<string, ModelGroup>;

  // Keys.
  name: string;

  // Values.
  cache?: {
    chosen: ModelGroup,
    experimental?: ModelGroup,
    stable?: ModelGroup,
  };

  constructor({ name }: { name: string; }) {
    this.name = name;
    this.groupedByModel = new Map<string, ModelGroup>();
  }

  add(record: LanguageModelHistoryBase) {
    const modelGroup: ModelGroup = this.groupedByModel.get(
      record.model
    ) ?? new ModelGroup({ name: record.model });
    modelGroup.add(record);
    this.groupedByModel.set(record.model, modelGroup);
    this.cache = undefined;
    return this;
  }

  // TODO: This MUST be a serialising operation. That means cache contains
  // serialised objects, not classes. Otherwise it won't get through IPC.
  get values() {
    console.log('operation group values', this.cache, this.groupedByModel)
    if (this.cache === undefined) {
      let experimental: ModelGroup | undefined;
      let stable: ModelGroup | undefined;

      this.groupedByModel.forEach((modelGroup) => {
        const { isExperimental, mean, median } = modelGroup.values;
        if (isExperimental) {
          // If there is an experimental model and it's better than the subject,
          // we leave it as is.
          if (experimental !== undefined
            && experimental.values.median < median
          ) return;

          // Otherwise, that should mean either there is no experimental model
          // set or the subject is better.
          return experimental = modelGroup;
        }

        // If there is an stable model and it's better than the subject,
        // we leave it as is.
        if (stable !== undefined
          && stable.values.median < median
        ) return;

        // Otherwise, that should mean either there is no stable model
        // set or the subject is better.
        return stable = modelGroup;
      });

      this.cache = {
        chosen: experimental ?? stable as ModelGroup,
        experimental,
        stable,
      };
    }
    return this.cache;
  }
};

export type LanguageModelLeading = {
  chosen: ModelGroup;
  experimental: ModelGroup | undefined;
  name: string;
  stable: ModelGroup | undefined;
};
