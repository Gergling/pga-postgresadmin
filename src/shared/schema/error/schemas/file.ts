import z from "zod";

export const errorFilePermissionDeniedSchema = z.object({
  errno: z.literal(-4048),
  code: z.literal('EPERM'),
  syscall: z.string(),
  path: z.string(),
});

export type ErrorFilePermissionDeniedSchema = z.infer<typeof errorFilePermissionDeniedSchema>;
