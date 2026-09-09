import {
  LanguageModelListFunction,
  LanguageModelProps,
  LanguageModelSourceLevelResponse,
  LanguageModelTransformFunctionParams
} from "@/shared/features/llm";
import {
  LanguageModelGeneratorFunctionParams,
} from "./base";
import { LogApi } from "../../logging";

export type LanguageModelSourceLevelProps = Omit<LanguageModelProps, 'source'>;

export type LanguageModelSourceLevelGeneratorFunction = (
  props: LanguageModelGeneratorFunctionParams & { model: string; }
) => Promise<LanguageModelSourceLevelResponse>;

export type LanguageModelSourceLevelTransformFunctionParams<T> = Required<Omit<
  LanguageModelTransformFunctionParams<T>, 'source'
>>;
export type LanguageModelSourceLevelTransformFunction = <T>(
  props: LanguageModelSourceLevelTransformFunctionParams<T>
) => T;
export type LanguageModelSourceLevelTransformFunctionDefault = (
  props: Omit<LanguageModelSourceLevelTransformFunctionParams<unknown>, 'schema'>
) => string;

type LanguageModelSourceLevelConfigBase = {
  generate: LanguageModelSourceLevelGeneratorFunction;
  source: string;
  transform?: LanguageModelSourceLevelTransformFunction;
};
export type LanguageModelSourceLevelConfigParams =
  & LanguageModelSourceLevelConfigBase
  & {
    models: LanguageModelListFunction<LanguageModelSourceLevelProps[], LogApi>;
  }
  ;
export type LanguageModelSourceLevelConfigResponse =
  & LanguageModelSourceLevelConfigBase
  & {
    models: LanguageModelListFunction<LanguageModelProps[], LogApi>;
  }
  ;

export type LanguageModelSourceLevelFunction = (
  props: LanguageModelSourceLevelConfigParams
) => LanguageModelSourceLevelConfigResponse;
