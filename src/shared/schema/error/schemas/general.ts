import z from "zod";

export const generalErrorSchema = z.object({
  cause: z.enum(['permission', 'unknown']),
  operation: z.string(),
  raw: z.unknown(),
  scope: z.discriminatedUnion('type', [
    z.object({
      path: z.string(),
      type: z.literal('file'),
    }),
    z.object({ type: z.literal('unknown') })
  ]),
  text: z.string(),
}).default({
  cause: 'unknown',
  operation: '',
  raw: {},
  scope: { type: 'unknown' },
  text: ''
});

export type GeneralError = z.infer<typeof generalErrorSchema>;
