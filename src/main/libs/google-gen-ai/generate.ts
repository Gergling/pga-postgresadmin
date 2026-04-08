import {
  GenerateContentConfig,
  GoogleGenAI,
  Model
} from '@google/genai';
import { GEMINI_API_KEY, GEMINI_DEFAULT_MODEL } from './constants';
import { LanguageModelResponse } from '@main/shared/llm';
import {
  getFallbackModel,
  stringifyGeminiError,
  transformGeminiError
} from './utilities';

export const listAvailableModels = () => ai.models.list();

const fetchFallbackModel = async (
  tried: string[]
): Promise<Model | undefined> => {
  const models = await listAvailableModels();
  const model = getFallbackModel(models.page, tried);
  // TODO: If model is undefined, we will ultimately need to check the next
  // page until we run out of pages or get a model.
  return model;
};

const fetchModel = async (
  preferredModel: string,
  tried: string[]
): Promise<string | undefined> => {
  if (tried.length === 0) return preferredModel;
  const model = await fetchFallbackModel(tried);
  return model?.name;
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
    const content = await ai.models.generateContent({
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
