import z from "zod";

export const taskWorkflowStateSchema = z.enum([
  'proposed', 'todo', 'doing', 'done', 'rejected'
]);
export type TaskWorkflowState = z.infer<typeof taskWorkflowStateSchema>;

export const taskWorkflowEventSchema = z.enum([
  'approve', 'dismiss', 'finalize', 'pause', 'start'
]);
export type TaskWorkflowEvent = z.infer<typeof taskWorkflowEventSchema>;

export const taskSourceTypeManualSchema = z.literal('manual');
export type TaskSourceTypeManual = z.infer<typeof taskSourceTypeManualSchema>;

export const taskSourceTypeAutomatedSchema = z.enum([
  'email', 'diary', 'instructions'
]);
export type TaskSourceTypeAutomated = z.infer<typeof taskSourceTypeAutomatedSchema>;

export const taskSourceTypeSchema = z.union([
  taskSourceTypeManualSchema,
  taskSourceTypeAutomatedSchema
]);
/**
 * All task source types.
 */
export type TaskSourceType = z.infer<typeof taskSourceTypeSchema>;

export const taskSourceSchema = z.union([
  z.object({
    id: z.string(),
    type: taskSourceTypeAutomatedSchema
  }),
  z.object({
    id: z.never().optional(),
    type: taskSourceTypeManualSchema
  })
]);
export type TaskSource = z.infer<typeof taskSourceSchema>;
