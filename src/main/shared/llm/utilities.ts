import { LanguageModelErrorResponse } from "./types";

export const mapLanguageModelError = <
  LanguageModelSource extends string
>(props: Omit<
  LanguageModelErrorResponse<LanguageModelSource>,
  '_wsu'
>): LanguageModelErrorResponse<LanguageModelSource> => ({
  _wsu: 'WSU_RESPONSE',
  ...props,
});
