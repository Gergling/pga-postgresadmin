import ollama from 'ollama';

const loadOllamaModelList = async (preferred, excluded) => {
    const { models } = await ollama.list();
    const metadatas = await Promise.all(
      models.map(({ name }) => ollama.show({ model: name }))
    );
    // const thinking = parameters.includes('think') || systemInfo.toLowerCase().includes('reasoning')
    return models.map(({ name, ...model }, i) => {
      const metadata = metadatas[i];
      parameters.includes('think') || systemInfo.toLowerCase().includes('reasoning')
      return {
        name, thinking, temperature,
        tokenLimits: {
          input: model.inputTokenLimit,
          output: model.outputTokenLimit,
        },
      };
    });
  }