type Fncs<T> = (() => T)[];

export function fallback <Response>(fncs: Fncs<Response>): Response | undefined;
export function fallback <Response>(fncs: Fncs<Response>, error: string): Response;
export function fallback <Response>(
  fncs: (() => Response)[], error?: string
) {
  const errors = [];
  for (const fn of fncs) {
    try {
      return fn();
    } catch (e) {
      errors.push(e);
    }
  }

  if (!error) return;
  console.error(errors);
  throw new Error(`Fallback failed: ${error}`);
}
