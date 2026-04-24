import {
  GoogleGenAI,
} from '@google/genai';
import { fetchAppSettings } from '@main/shared/settings';

let ai: GoogleGenAI | null = null;

export const fetchGoogleGenAIInstance = async () => {
  if (!ai) {
    const { gemini: { apiKey } } = await fetchAppSettings()
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};
