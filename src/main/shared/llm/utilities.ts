import { LanguageModelErrorResponse } from "./types";

export const mapLanguageModelError = (props: Omit<
  LanguageModelErrorResponse,
  '_wsu'
>): LanguageModelErrorResponse => ({
  _wsu: 'WSU_RESPONSE',
  ...props,
});
