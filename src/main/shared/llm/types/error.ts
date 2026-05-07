import { LanguageModelResponseStatus } from "./schema";

export type LanguageModelErrorType =
  | Exclude<LanguageModelResponseStatus, 'success'>
  | 'undefined-text'
  | 'no-model'
;

export type LanguageModelErrorResponse<LanguageModelSource extends string> = {
  _wsu: 'WSU_RESPONSE'; // This is just to make sure it can't be confused with
  // library types.
  data: object;
  source: LanguageModelSource;
  type: LanguageModelErrorType;
};
