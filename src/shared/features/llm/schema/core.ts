import z from "zod";

export const runtimeNumericErrorCodes = {
  UNREADABLE_PROPERTY: -1,
  IRRETRIEVABLE_RECORD: -2,
};
export const runtimeStringErrorCodes = {
  UNREADABLE_PROPERTY: 'PROPERTY_UNREADABLE',
  IRRETRIEVABLE_RECORD: 'RECORD_IRRETRIEVABLE',
};

export const llmModelIdentifierSchema = z.object({
  model: z.string(),
  source: z.string(),
});
export const llmOperationIdentifierSchema = z.object({
  operation: z.string(),
});

/**
 * @deprecated Use `llmModelIdentifierSchema` instead.
 */
export const llmCoreIdentifierSchema = z.object({
  name: z.string().catch(runtimeStringErrorCodes.UNREADABLE_PROPERTY),
  source: z.string().catch(runtimeStringErrorCodes.UNREADABLE_PROPERTY),
}).catch({
  name: runtimeStringErrorCodes.IRRETRIEVABLE_RECORD,
  source: runtimeStringErrorCodes.IRRETRIEVABLE_RECORD,
});

export type LlmCoreIdentifier = z.infer<typeof llmCoreIdentifierSchema>;

export type LlmCorePriority = 'excluded' | 'preferred';
