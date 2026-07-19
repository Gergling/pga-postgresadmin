import { GeneralError } from "../schemas";
import { transformObjectError } from "./object";

export const transformError = (e: unknown): GeneralError => {
  if (typeof e === 'object' && e !== null) {
    const result = transformObjectError(e);
    if (result) return result;
  }

  return {
    cause: 'unknown',
    operation: 'unknown',
    raw: e,
    scope: { type: 'unknown' },
    text: `An uncategorised error occurred: ${e}`,
  };
};
