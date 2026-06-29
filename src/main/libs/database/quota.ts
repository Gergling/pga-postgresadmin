// SO what do we do about triggering the sync?
// 50,000 document reads and 20,000 document writes
// Storage & Bandwidth: Includes 1 GB of database storage and 10 GB of outbound network data transfer per month.
// All daily quotas reset exactly at midnight Pacific Time (PT).
// So we can take the number of minutes left of the day before midnight PT as a
// proportion of the number of minutes in a day.

import z from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { optionsDb } from "./options";

const MS_IN_DAY = 24 * 60 * 60 * 1000;
const nowPt = () => Temporal.Now.zonedDateTimeISO(
  'America/Los_Angeles'
);
const nowPtMs = () => nowPt().epochMilliseconds;
const midnightPtMs = () => nowPt().with(
  { hour: 0, minute: 0, second: 0, millisecond: 0 }
).add({ days: 1 }).epochMilliseconds;

const timeUntilTimeout = () => { };

// Extract the data from the database. The value is unknown and needs to become
// a number. If it's undefined, default to 0.
// Update the data can default the value to 1.
// Populate the data in the first place defaults the number to 0.

// const remoteQuotaNameOptionsSchema = z.enum(['reads', 'writes']);
// type RemoteQuotaNameParams = z.infer<typeof remoteQuotaNameOptionsSchema>;
const remoteQuotaNamesSchema = z.object({
  reads: z.array(z.enum(['updated-reads', 'value-reads'])),
  writes: z.array(z.enum(['updated-writes', 'value-writes'])),
});
type RemoteQuotaNames = z.infer<typeof remoteQuotaNamesSchema>;
type RemoteQuotaNameParams = keyof RemoteQuotaNames;
const getOptionNames = (
  name: RemoteQuotaNameParams
) => remoteQuotaNamesSchema.def.shape[name].def.element.options;

// const remoteQuotaNameSchema = z.enum(remoteQuotaNamesSchema.flat());
// // type RemoteQuotaName = z.infer<typeof remoteQuotaNameSchema>;
// ]);


const remoteQuotaValueSchema = z.unknown().optional().transform(
  (value) => {
    if (typeof value === 'number') return value;
    return 0;
  }
);
const remoteQuotaGroupSchema = z.enum(['firebase']);
const remoteQuotaGroupDefaultSchema = remoteQuotaGroupSchema.default('firebase');

// const remoteQuotaUpdatedSchema = z.

// const remoteQuotaSchema = z.object({
//   name: remoteQuotaNameSchema,
//   value: remoteQuotaValueSchema,
//   group: remoteQuotaGroupDefaultSchema,
//   updated: z.number(),
// });

const remoteQuotaOptionsParamsSchema = z.object({
  group: remoteQuotaGroupDefaultSchema.optional(),
  value: z.number().optional().default(1),
});
type RemoteQuotaOptions = z.infer<typeof remoteQuotaOptionsParamsSchema>;

export const updateRemoteQuota = async (
  name: RemoteQuotaNameParams,
  options?: RemoteQuotaOptions,
) => {
  const { group, value } = remoteQuotaOptionsParamsSchema.parse(options);
  const updated = nowPtMs();
  const $in = getOptionNames(name);
  // return optionsDb.db.updateAsync({
  //   group, name: { $in },
  // }, {}, {
  //   multi: true,
  //   upsert: true,
  // });
  await optionsDb.db.updateAsync({
    group, name
  }, {
    $inc: { value },
    $set: { updated }
  }, { upsert: true });
  await optionsDb.db.updateAsync({
    group, name
  }, {
    $inc: { value },
    $set: { updated }
  }, { upsert: true });
};

/**
 * 
 * @param name The quota name, either `read` or `write`.
 * @returns 
 */
export const readRemoteQuota = async (name: RemoteQuotaName): Promise<number> => {
  const result = await optionsDb.db.findAsync({ group: 'firebase', name });
  const [option] = result;

  if (!option) {
    await updateRemoteQuota(name, { value: 0 });
    return remoteQuotaValueSchema.parse(undefined);
  }
  const { value } = option;
  return remoteQuotaValueSchema.parse(value);
};
