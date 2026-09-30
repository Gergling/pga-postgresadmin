import { cos_sim } from '@huggingface/transformers';

type CosineSimilarityOptions = {
  normalisation?: 'positive' | 'negative';
};

const defaultOptions: Required<CosineSimilarityOptions> = {
  normalisation: 'positive',
};

export const cosineSimilarity = (
  a: number[], b: number[], options?: CosineSimilarityOptions
) => {
  const configOptions: Required<CosineSimilarityOptions> = {
    ...defaultOptions, ...options
  };
  const result = cos_sim(a, b);
  if (configOptions.normalisation === 'positive') return Math.max(0, result);
  return result;
};
