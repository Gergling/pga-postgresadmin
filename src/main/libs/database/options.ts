import z from "zod";
import { now, nowUTCMs } from "@/shared/utilities";
import { setupBasicNeDb } from "../nedb";

const schema = z.object({
  group: z.string(),
  name: z.string(),
  value: z.unknown(),
  updated: z.number().default(nowUTCMs),
});

export const optionsDbSchema = z.unknown().transform(value => {
  // console.log('TRANSFORM', value)
  return value
}).pipe(schema);
type Options = z.infer<typeof optionsDbSchema>;

export const optionsDb = setupBasicNeDb<Options>('options');

export const optionsAll = () => optionsDb.db.getAllData();

export const optionsUpsert = (
  data: Omit<Options, 'updated'>
) => optionsDb.db.updateAsync(
  { group: data.group, name: data.name },
  { $set: optionsDbSchema.parse(data) },
  { upsert: true }
);
export const optionsFetch = async (
  group: string, name: string
) => {
  const result = await optionsDb.db.findOneAsync({ group, name });
  if (!result) return undefined;
  return schema.parse(result);
};
