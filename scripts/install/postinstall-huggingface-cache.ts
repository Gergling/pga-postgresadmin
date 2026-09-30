import { env } from '@huggingface/transformers';
import { fetchExtractor } from '@/shared/lib/huggingface/pipeline';
import { log } from '@/main/shared/logging/';

// Allow internet access just for this pre-download step
env.allowRemoteModels = true;

async function preCache() {
  return log('Caching huggingface models', fetchExtractor); // Takes care of asynch try/catch logging.
}

preCache();//.catch(console.error);
