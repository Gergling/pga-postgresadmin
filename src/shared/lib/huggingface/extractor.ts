import { env } from '@huggingface/transformers';
import { fetchExtractor } from './pipeline';

env.allowRemoteModels = false;

const extractor = await fetchExtractor();

export const extractEmbedding = (text: string) => extractor(
  text, { pooling: 'mean', normalize: true }
);
