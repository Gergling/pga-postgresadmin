export type LlmValidationResult<T> = {
  success: true;
  value: T;
  message?: string;
} | {
  success: false;
  value?: T;
  message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LlmValidator<T> = (value: any) => LlmValidationResult<T>;

export type LlmResponseSchema<T> = {
  [K in keyof T]: LlmValidator<T[K]>;
};
