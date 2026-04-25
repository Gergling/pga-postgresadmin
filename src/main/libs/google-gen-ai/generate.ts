import {
  GenerateContentConfig,
} from '@google/genai';
import { GEMINI_DEFAULT_MODEL } from './constants';
import { LanguageModelResponse } from '@main/shared/llm';
import {
  stringifyGeminiError,
  transformGeminiError
} from './utilities';
import { fetchModel, wrapper } from './extractors';

type GeminiContentParams = {
  preferredModel?: string;
  tried?: string[];
};

export const generateContent = async ({
  config, contents, preferredModel = GEMINI_DEFAULT_MODEL, tried = []
}: GeminiContentParams & {
  config?: GenerateContentConfig;
  contents: string;
}): Promise<LanguageModelResponse> => {
  // We choose a model based on what's preferred and the fallback mechanism.
  const model = await fetchModel(preferredModel, tried);

  try {
    // If we don't have a model, we throw.
    if (model === undefined) throw new Error(stringifyGeminiError('no-model'));

    // We run the language model.
    const content = await wrapper({
      model,
      contents,
      config,
    });
    console.log('Gemini Call Response:', content);

    // If we don't have a text response, we throw.
    if (content.text === undefined) throw new Error(
      stringifyGeminiError('undefined-text')
    );

    return {
      content: content.text,
      type: 'success',
    };
  } catch (caught) {
    return transformGeminiError(caught, model);
  }
};
