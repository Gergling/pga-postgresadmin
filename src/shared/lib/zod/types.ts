import z from "zod";

export type SharedZodSchema<T> = {
  main: z.input<T>;
  renderer: z.output<T>;
};
