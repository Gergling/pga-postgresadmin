export type UncertainBoolean = 'yes' | 'no' | 'unknown';

// Command types
export type CommandResponse = {
  error?: string;
  stderr?: string;
  stdout?: string;
};

export type CommandStatusResponse<T = boolean> = CommandResponse & {
  status: T;
};

// Response types
export type GeneralResponse = {
  success: boolean;
  error?: string;
};

export type MutationResponse<T> = {
  data: T;
  error?: never;
  success: true;
} | {
  data?: never;
  error: string;
  success: false;
};

// Common types
export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
export type Mandatory<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>;
export type Swap<
  Subject,
  SubjectProp extends keyof Subject,
  Substitute
> = Omit<Subject, SubjectProp> & Record<SubjectProp, Substitute>;
export type DeepPartial<T extends object> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Envelope<T> = { id: string | number; content: T; created: number; };
