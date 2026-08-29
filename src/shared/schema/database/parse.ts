import z from "zod";

// Experiment #ihavelostcount: Using a function to extract from a source which
// may have stored an unknown format.

export const parserFactory = <T extends object>({
  fallback, schema
}: {
  fallback: T; schema: z.ZodType<T>;
}) => <U extends Partial<T> | undefined>(
  data: U
) => {
    const result = schema.safeParse(data);
    if (result.success) return result.data;

    // const { error } = result;

    return {
      ...fallback,
      ...data,
    };
  };
