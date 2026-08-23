import z from "zod";
import {
  languageModelResponseStatusOptions,
  LanguageModelHistoryBaseStatus,
  languageModelResponseStatus
} from "./response";
import { runtimeNumericErrorCodes, runtimeStringErrorCodes } from "./core";

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

const irretrievableRecord: LanguageModelHistoryBase = {
  model: 'RECORD_IRRETRIEVABLE',
  operation: 'RECORD_IRRETRIEVABLE',
  runtime: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
  source: 'RECORD_IRRETRIEVABLE',
  status: 'success',
  timestamp: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
};
const unreadablePropertiesSchema = z.object({
  model: shape.model.catch(runtimeStringErrorCodes.UNREADABLE_PROPERTY),
  operation: shape.operation.catch(runtimeStringErrorCodes.UNREADABLE_PROPERTY),
  runtime: shape.runtime.catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
  source: shape.source.catch(runtimeStringErrorCodes.UNREADABLE_PROPERTY),
  status: shape.status.catch('success'),
  timestamp: shape.timestamp.catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
});

const transformUnknownHistoryItem = (value: unknown): LanguageModelHistoryBase => {
  if (typeof value !== 'object' || value === null) return irretrievableRecord;
  return unreadablePropertiesSchema.parse(value);
}

export const languageModelHistorySchema = z.unknown().transform(
  transformUnknownHistoryItem
);
