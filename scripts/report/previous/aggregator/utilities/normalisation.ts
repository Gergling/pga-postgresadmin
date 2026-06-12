import { VisibilityStatus } from "../types";

export const getNormalisedVisibilityFactory = (
  aggregationName: string,
) => (
  visibility: VisibilityStatus
) => ({
  [aggregationName]: visibility,
}) as Record<string, VisibilityStatus>;
