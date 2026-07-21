import z from "zod";
import { nowUTCMs } from "@/shared/utilities";
import { resolveAbsolutePath } from "./utilities";

export const explorerParentPathSchema = z.string().transform(resolveAbsolutePath);

export const explorerFileRecordQuerySchema = z.object({
  name: z.string(),
  parentPath: explorerParentPathSchema,
});

export type ExplorerFileRecordQuery = z.infer<typeof explorerFileRecordQuerySchema>;

export const explorerFileRecordActionValues = [
  'ascend', 'analyse', 'defer', 'descend', 'none', 'scan', 'skip'
] as const;

export type ExplorerFileRecordAction = typeof explorerFileRecordActionValues[number];

export const explorerFileRecordActionEnum = z.unknown().transform(
  (action: ExplorerFileRecordAction): ExplorerFileRecordAction => {
    if (!explorerFileRecordActionValues.includes(action)) return 'analyse';
    return action;
  }
);

export const explorerFileRecordPayloadSchema = z.object({
  action: explorerFileRecordActionEnum.default('none'),
  health: z.enum(['ok', 'duplicate', 'orphan', 'corrupt']).default('ok'),
  isDirectory: z.boolean(),
  updated: z.number().describe('UTC epoch milliseconds').default(nowUTCMs),
  usage: z.number().optional(),
});

export type ExplorerFileRecordPayload = z.infer<
  typeof explorerFileRecordPayloadSchema
>;

export const explorerFileRecordSchema = explorerFileRecordQuerySchema.extend(
  explorerFileRecordPayloadSchema.shape
);

export type ExplorerFileRecordProps = z.infer<typeof explorerFileRecordSchema>;
