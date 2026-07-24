import z from "zod";
import {
  envelopeCodecFactory,
  envelopeRichSchemaFactory,
  envelopeSerialisationSchemaFactory
} from "@/shared/schema";
import { taskSourceSchema, taskWorkflowStateSchema } from "./base";
import { councilVotesMapSchema } from "./votes";

export const taskCoreSchema = z.object({
  description: z.string(),
  source: taskSourceSchema,
  status: taskWorkflowStateSchema,
  summary: z.string(),
  timeline: z.object({
    completed: z.number().optional(),
    due: z.number().optional(),
    start: z.number().optional(),
  }).default({}),
  votes: councilVotesMapSchema,
});

export type TaskCore = z.infer<typeof taskCoreSchema>;

export const taskSerialisationSchema = envelopeSerialisationSchemaFactory({
  data: taskCoreSchema,
});
export type TaskSerialisation = z.infer<typeof taskSerialisationSchema>;

export const taskRichSchema = envelopeRichSchemaFactory({
  data: taskCoreSchema,
});
export type TaskRich = z.infer<typeof taskRichSchema>;

export const taskEnvelopeCodec = envelopeCodecFactory<(typeof taskCoreSchema)['shape']>(
  taskSerialisationSchema,
  taskRichSchema
);
