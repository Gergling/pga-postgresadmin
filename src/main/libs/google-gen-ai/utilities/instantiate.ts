import {
  GoogleGenAI,
} from '@google/genai';
import { loadAppSettings } from '@/main/shared/settings';

let ai: GoogleGenAI | null = null;

export const fetchGoogleGenAIInstance = async () => {
  if (!ai) {
    const { gemini } = await loadAppSettings()
    ai = new GoogleGenAI({ apiKey: gemini?.apiKey });
  }
  return ai;
};
