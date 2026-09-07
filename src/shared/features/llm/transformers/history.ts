import { languageModelHistorySchema } from "../schema";

export const llmParseHistory = (
  data: unknown[]
) => data.map((value) => languageModelHistorySchema.parse(value));
