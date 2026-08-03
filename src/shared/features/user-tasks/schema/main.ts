import z from "zod";
import {
  envelopeRichSchemaFactory,
  envelopeSerialisationSchemaFactory,
  richDateSchema,
  serialisationDateSchema,
} from "@/shared/schema";
import { taskSourceSchema, taskWorkflowStateSchema } from "./base";
import { councilVotesMapSchema } from "./votes";

const taskCoreTimelineRichSchema = z.object({
  completed: richDateSchema.optional(),
  due: richDateSchema.optional(),
  start: richDateSchema.optional(),
}).catch({});
const taskCoreTimelineSerialisationSchema = z.object({
  completed: serialisationDateSchema.optional(),
  due: serialisationDateSchema.optional(),
  start: serialisationDateSchema.optional(),
}).catch({});

const taskCoreBaseSchema = z.object({
  description: z.string().catch(''),
  source: taskSourceSchema.catch({ type: 'manual' }),
  status: taskWorkflowStateSchema,
  summary: z.string().catch(''),
  votes: councilVotesMapSchema,
});

export const taskCoreSchema = taskCoreBaseSchema.extend({
  timeline: taskCoreTimelineRichSchema
});
export const taskCoreSerialisedSchema = taskCoreBaseSchema.extend({
  timeline: taskCoreTimelineSerialisationSchema
});

export type TaskCore = z.infer<typeof taskCoreSchema>;
export type TaskCoreSerialised = z.infer<typeof taskCoreSerialisedSchema>;

export const taskSerialisationSchema = envelopeSerialisationSchemaFactory({
  data: taskCoreSerialisedSchema,
});
export type TaskSerialisation = z.infer<typeof taskSerialisationSchema>;

export const taskRichSchema = envelopeRichSchemaFactory({
  data: taskCoreSchema,
});
export type TaskRich = z.infer<typeof taskRichSchema>;
