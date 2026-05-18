import {
  languageModelSourceLevelConfig,
  LanguageModelSourceLevelProps
} from "@main/shared";
import { catchGeminiError, fetchGoogleGenAIInstance } from "./utilities";

export const googleLanguageModelConfig = languageModelSourceLevelConfig({
  source: 'google',
  models: async (preferred, excluded) => {
    const ai = await fetchGoogleGenAIInstance();
    const models = await ai.models.list();
    // TODO: Needs an iteration system for the next page at some point.
    return models.page.reduce((acc, {
      name, temperature, ...model
    }) => {
      if (name === undefined) return acc;
      if (excluded.includes(name)) return acc;
      const thinking = !!model.thinking;
      return [
        ...acc,
        {
          local: false,
          name, thinking, temperature,
          tokenLimits: {
            input: model.inputTokenLimit,
            output: model.outputTokenLimit,
          },
        }
      ];
    }, [] as LanguageModelSourceLevelProps[]);
  },
  generate: async ({ model, prompt, schema, temperature }) => {
    const ai = await fetchGoogleGenAIInstance();
    try {
      const response = await ai.models.generateContent({
        contents: prompt,
        model,
        config: {
          temperature,
          responseJsonSchema: schema?.toJSONSchema(),
        },
      });
      if (response.text === undefined) throw new Error(`Model generated an undefined response. This will need handling.`);
      // TODO: Need a separate status output for a response which has succeeded
      // in generating the output, but may need to try again if it didn't follow
      // the schema when outputting the JSON format.
      return {
        canRetry: false,
        model,
        response: response.text,
        status: 'success',
      };
    } catch (error) {
      return catchGeminiError(error, model);
    }
  },
});
