import { env, pipeline } from "@huggingface/transformers";

export const fetchExtractor = () => {
  env.localModelPath = './node_modules/@huggingface/transformers/.cache/';
  return pipeline(
    'feature-extraction', 'onnx-community/all-MiniLM-L6-v2-ONNX'
  );
}
