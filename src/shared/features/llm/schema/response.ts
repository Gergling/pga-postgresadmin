import z from "zod";
import { getObjectKeys } from "@/shared/utilities";

const LanguageModelResponseSchemaBase = z.object({
  model: z.string(),
});
const LanguageModelResponseSchemaSourceExtension = z.object({
  source: z.string(),
});
const LanguageModelResponseSchemaRetryTimeoutExtension = z.object({
  retryTimeout: z.number().optional(),
});
const getLanguageModelResponseSchemaSuccessExtension = <T>(
  response: z.ZodType<T>
) => z.object({
  ...LanguageModelResponseSchemaRetryTimeoutExtension.shape,
  canRetry: z.literal(false),
  response: response ?? z.string(), status: z.literal('success'),
});
export type LanguageModelResponseSchemaSuccess<T> = z.infer<
  ReturnType<typeof getLanguageModelResponseSchemaSuccessExtension<T>>
>;
const LanguageModelResponseSchemaRetryableExtension = z.object({
  ...LanguageModelResponseSchemaRetryTimeoutExtension.shape,
  canRetry: z.literal(true),
  status: z.union([
    z.literal('rate-limitations').describe(
      'Model access was rate-limited (e.g. 429).'
    ),
    z.literal('traffic').describe(
      'Model was unavailable due to high traffic (e.g. 503).'
    ),
    z.literal('parsing-incompatibility').describe(
      'The output was not a JSON-compatible string.'
    ),
    z.literal('string-retry').describe(
      'The output was a string and the options were set to retry strings.'
    ),
  ]),
});
const LanguageModelResponseSchemaFailureExtension = z.object({
  canRetry: z.literal(false),
  message: z.string(),
  status: z.enum(['failed', 'unexpected']),
});
const getLanguageModelResponseSchemaDiscriminatedUnionByStatus = <T>(
  response: z.ZodType<T>
) => z.discriminatedUnion('status', [
  LanguageModelResponseSchemaFailureExtension,
  LanguageModelResponseSchemaRetryableExtension,
  getLanguageModelResponseSchemaSuccessExtension<T>(response),
]);
const LanguageModelResponseSchemaDiscriminatedUnionByStatus = getLanguageModelResponseSchemaDiscriminatedUnionByStatus(z.string());

const getLanguageModelResponseSchema = <T>(response: z.ZodType<T>) => z.object({
  runtime: z.number(),
  ...LanguageModelResponseSchemaBase.shape,
  ...LanguageModelResponseSchemaSourceExtension.shape,
}).and(getLanguageModelResponseSchemaDiscriminatedUnionByStatus(response));

export type LanguageModelResponseSchema<T> = z.infer<
  ReturnType<typeof getLanguageModelResponseSchema<T>>
>;
// The raw generator is probably going to send back a string.
export type LanguageModelGeneratorResponse = LanguageModelResponseSchema<string>;

export type LanguageModelSourceLevelResponse = z.infer<
  typeof LanguageModelResponseSchemaBase
> & z.infer<typeof LanguageModelResponseSchemaDiscriminatedUnionByStatus>;

export const languageModelResponseStatusSchema = <T>(response: z.ZodType<T>) => z.union(
  getLanguageModelResponseSchema(response).def.right.def.options.map(
    (option) => option.shape.status
  )
);

export type LanguageModelResponseStatus = z.infer<
  ReturnType<typeof languageModelResponseStatusSchema>
>;

export type LanguageModelResponseStatusRetryable = z.infer<
  typeof LanguageModelResponseSchemaRetryableExtension.shape.status
>;

export const languageModelResponseStatus = languageModelResponseStatusSchema(z.string());
export type LanguageModelHistoryBaseStatus = z.infer<typeof languageModelResponseStatus>;
export const languageModelResponseStatusOptions = languageModelResponseStatus.options.reduce(
  (acc: LanguageModelHistoryBaseStatus[], props) => {
    switch (props.type) {
      case 'enum':
        return [...acc, ...getObjectKeys(props.enum)];
      case 'literal':
        return [...acc, ...props.values];
      case 'union':
        return [...acc, ...props.options.reduce((cunt, swine) => [...cunt, ...swine.values], [])]
    }
  },
  []
);
