import { GoogleGenAI } from '@google/genai';
import { getEnvVar } from "../../env";

const apiKey = getEnvVar('VITE_GEMINI_API_KEY');
const ai = new GoogleGenAI({ apiKey });
const model = 'gemini-flash-latest';

export const generateContent = async (contents: string) => {
  const response = await ai.models.generateContent({
    model,
    contents,
  });
  console.log('Gemini Call Response:', response);
  return response.text;
};

export const listAvailableModels = () => ai.models.list();
