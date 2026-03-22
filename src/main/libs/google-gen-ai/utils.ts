import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY, GEMINI_MODEL } from './constants';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateContent = async (contents: string) => {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents,
  });
  console.log('Gemini Call Response:', response);
  return response.text;
};

export const listAvailableModels = () => ai.models.list();
