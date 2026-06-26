import z from "zod";

export const metaCollectionSchema = z.object({
  name: z.string().describe(
    'The collection name can go in here, unless it is not allowed.'
  ),
  local: z.number().optional().describe(
    'This should be updated with the local write time in UTC epoch milliseconds.'
  ),
  sync: z.number().optional().describe(
    'This should be updated with the restoration time in UTC epoch milliseconds.'
  ),
});

export type MetaCollection = z.infer<typeof metaCollectionSchema>;
