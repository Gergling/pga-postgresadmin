import z from "zod";

export const taskIpcReadParametersSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal('id'),
    id: z.string()
  }),
  z.object({
    type: z.literal('incomplete')
  })
]);

export type TaskIpcReadParameters = z.infer<typeof taskIpcReadParametersSchema>;
