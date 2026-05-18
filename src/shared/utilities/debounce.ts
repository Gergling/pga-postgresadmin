type RetryOptions = {
  maxAttempts: number;
  baseDelay: number; // in ms
  maxDelay: number;
};

/**
 * Calculates delay using Full Jitter (random 0 to max exponential backoff)
 */
const calculateJitterDelay = (attempt: number, options: RetryOptions): number => {
  const expBackoff = options.baseDelay * Math.pow(2, attempt);
  const cappedBackoff = Math.min(expBackoff, options.maxDelay);
  return Math.random() * cappedBackoff; // Full Jitter
};

/**
 * Reusable retry wrapper with TypeScript generics
 */
export async function withRetry<T>(
  fn: () => Promise<T>, 
  options: RetryOptions = { maxAttempts: 5, baseDelay: 1000, maxDelay: 30000 }
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Unless it's a 429, we just throw it.
      // if (error.response?.status !== 429) throw error;

      // const retryAfter = error.response?.headers?.['retry-after'];
      // const delay = retryAfter 
      //   ? parseInt(retryAfter) * 1000 
      //   : calculateJitterDelay(attempt, options);

      if (attempt < options.maxAttempts - 1) {
        // await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  throw lastError;
}
