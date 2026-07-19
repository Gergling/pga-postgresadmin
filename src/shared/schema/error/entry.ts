import { errorSchema } from "./schemas";

export const parseError = (e: unknown) => errorSchema.parse(e);
