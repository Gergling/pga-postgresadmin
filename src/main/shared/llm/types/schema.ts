import z from "zod";

const LanguageModelResponseSchemaBase = z.object({
  model: z.string(),
});
const LanguageModelResponseSchemaSourceExtension = z.object({
  source: z.string(),
});
const getLanguageModelResponseSchemaSuccessExtension = <T>(
  response: z.ZodType<T>
) => z.object({
  canRetry: z.literal(false),
  response: response ?? z.string(), status: z.literal('success')
});
const LanguageModelResponseSchemaRetryableExtension = z.object({
  canRetry: z.literal(true),
  retryTimeout: z.number().optional(),
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
  ]),
});
const LanguageModelResponseSchemaFailureExtension = z.object({
  canRetry: z.literal(false),
  message: z.string(),
  status: z.literal('failed'),
});
const getLanguageModelResponseSchemaDiscriminatedUnionByStatus = <T>(
  response: z.ZodType<T>
) => z.discriminatedUnion(
  'status', [
    LanguageModelResponseSchemaFailureExtension,
    LanguageModelResponseSchemaRetryableExtension,
    getLanguageModelResponseSchemaSuccessExtension<T>(response),
  ]
);
const LanguageModelResponseSchemaDiscriminatedUnionByStatus = getLanguageModelResponseSchemaDiscriminatedUnionByStatus(z.string());

const getLanguageModelResponseSchema = <T>(response: z.ZodType<T>) => z.object({
  ...LanguageModelResponseSchemaBase.shape,
  ...LanguageModelResponseSchemaSourceExtension.shape,
}).and(getLanguageModelResponseSchemaDiscriminatedUnionByStatus(response));

export type LanguageModelResponseSchema<T> = z.infer<
  ReturnType<typeof getLanguageModelResponseSchema<T>>
>;
export type LanguageModelGeneratorResponse = LanguageModelResponseSchema<string>;

export type LanguageModelSourceLevelResponse = z.infer<
  typeof LanguageModelResponseSchemaBase
> & z.infer<typeof LanguageModelResponseSchemaDiscriminatedUnionByStatus>;

const languageModelResponseStatusSchema = <T>(response: z.ZodType<T>) => z.union(
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
