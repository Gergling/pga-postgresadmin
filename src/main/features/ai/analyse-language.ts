import { generateContent } from "../../libs/google-gen-ai/utils";

// The purpose of this abstraction is to choose different possible language
// models while keeping the call simple.
// For example, if offline, the call may want to be made to the local language
// model.
// TODO: Return internal metadata on which language model is being used.
export const analyseLanguage = async (prompt: string): Promise<string> => {
  try {
    const response = await generateContent(prompt);
  
    if (response === undefined) {
      console.error('Language model analysis response was undefined.', prompt);
      throw new Error('Language model analysis response was undefined.');
    }
  
    return response;
  } catch (error) {
    console.error('Language model analysis failed:', error);
    throw error;
  }
};
