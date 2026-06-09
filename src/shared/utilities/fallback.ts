export const fallback = <Response>(
  fncs: (() => Response)[], error: string
): Response => {
  const errors = [];
  for (const fn of fncs) {
    try {
      return fn();
    } catch (e) {
      errors.push(e);
    }
  }

  console.error(errors);
  throw new Error(`Fallback failed: ${error}`);
};
