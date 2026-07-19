import z from "zod";

export const errorNodeErrnoExceptionSchema = z.object({
  code: z.string(),
  errno: z.number().optional(),
  path: z.string().optional(),
  syscall: z.string().optional(),
});

export type ErrorNodeErrnoExceptionSchema = z.infer<typeof errorNodeErrnoExceptionSchema>;