import {
  GenerateContentParameters,
  Model
} from '@google/genai';
import { fetchGoogleGenAIInstance, getFallbackModel } from '../utilities';

const fetchFallbackModel = async (
  tried: string[]
): Promise<Model | undefined> => {
  const ai = await fetchGoogleGenAIInstance();
  const models = await ai.models.list();
  const model = getFallbackModel(models.page, tried);
  // TODO: If model is undefined, we will ultimately need to check the next
  // page until we run out of pages or get a model.
  return model;
};

export const fetchModel = async (
  preferredModel: string,
  tried: string[]
): Promise<string | undefined> => {
  if (tried.length === 0) return preferredModel;
  const model = await fetchFallbackModel(tried);
  return model?.name;
}

export const wrapper = async (params: GenerateContentParameters) => {
  const ai = await fetchGoogleGenAIInstance();
  return ai.models.generateContent(params);
};
