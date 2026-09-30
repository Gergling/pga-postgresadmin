import z from "zod";

// File level

// This metadata is attached at the path level.
// For directories, it serves as an aggregation of the contents.
export const codePathSchema = z.object({
  breakdown: z.array(z.unknown()).optional(),
  summary: z.object({
    // Coverage found in test runs.
    coverage: z.number().optional().catch(() => undefined).describe(
      'The coverage percentage (or lines, whichever is easiest) for this file.'
    ),
    // Total number of lines found in traversal metadata scans.
    lines: z.number().describe('The number of lines for this file.'),
  })
});
