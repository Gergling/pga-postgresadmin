import ollama from 'ollama';
import {
  languageModelSourceLevelConfig,
  LanguageModelSourceLevelProps,
  mapLanguageModels
} from "@/main/shared";

export const ollamaLanguageModelConfig = languageModelSourceLevelConfig({
  source: 'ollama',
  models: async (preferred, excluded) => {
    const { models } = await ollama.list();
    const metadatas = await Promise.allSettled(
      models.map(({ name }) => ollama.show({ model: name }))
    );
    return mapLanguageModels(
      models, ({ name }) => excluded.includes(name), ({ name }) => {
        return {
          local: true, name, thinking: undefined, temperature: undefined,
          tokenLimits: {},
        }
      }
    );
  },
  generate: async ({ model, prompt, schema, temperature }) => {
    const gened = await ollama.generate({
      model,
    });
    const response = await ollama.chat({
      model: 'llama3.2:3b', 
      messages: [{ 
        role: 'user', 
        content: `Write a git commit message for this diff:\n${gitDiff}` 
      }],
      options: {
        temperature: 0.6,
        num_ctx: 16384 // Explicitly sets the context window size in tokens
      }
    });
  },
})