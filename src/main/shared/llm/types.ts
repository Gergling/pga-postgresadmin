import z from "zod";

export const getLanguageModelResponseSchema = <
  Response extends z.ZodType, Source extends z.ZodType<string>
>(responseSchema: Response, sourceSchema: Source) => z.object({
  model: z.string(),
  source: sourceSchema,
}).and(z.discriminatedUnion('status', [
  z.object({
    response: responseSchema,
    status: z.literal('success'),
  }),
  z.object({
    status: z.literal('traffic'),
  }),
]));

type LanguageModelResponse<Response, Source extends string> = z.infer<
  ReturnType<typeof getLanguageModelResponseSchema<
    z.ZodType<Response>, z.ZodType<Source>>
  >
>;

export type LanguageModelSourceMap<Name extends string, Response> = {
  [key in Name]: LanguageModelResponse<Response, Name>;
};

const languageModelResponseStatusSchema = z.union(getLanguageModelResponseSchema(
  z.string(), z.string()
).def.right.def.options.map((option) => option.shape.status));

export type LanguageModelResponseStatus = z.infer<
  typeof languageModelResponseStatusSchema
>;

export type LanguageModelErrorType =
  | Exclude<LanguageModelResponseStatus, 'success'>
  | 'undefined-text'
  | 'no-model'
;

export type LanguageModelErrorResponse<LanguageModelSource extends string> = {
  _wsu: 'WSU_RESPONSE'; // This is just to make sure it can't be confused with
  // library types.
  data: object;
  source: LanguageModelSource;
  type: LanguageModelErrorType;
};
