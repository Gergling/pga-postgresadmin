export type LanguageModelSource = 'gemini';

export type LanguageModelResponse = {
  content: string;
  type: 'success';
} | {
  model: string;
  type: 'traffic';
};

type LanguageModelResponseType = Exclude<
  LanguageModelResponse['type'],
  'success'
>;

export type LanguageModelErrorType =
  | LanguageModelResponseType
  | 'undefined-text'
  | 'no-model'
;

export type LanguageModelErrorResponse = {
  _wsu: 'WSU_RESPONSE'; // This is just to make sure it can't be confused with
  // library types.
  data: object;
  source: LanguageModelSource;
  type: LanguageModelErrorType;
};
