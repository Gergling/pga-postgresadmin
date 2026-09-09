import {
  LanguageModelProps,
} from "@/shared/features/llm";
import {
  LanguageModelOrchestrationListFunction,
  LanguageModelSourceLevelConfigResponse,
} from "../types";
import { llmReadOperationSummary } from "../crud";
import { fetchModels } from "../extraction";
import { compareLanguageModels } from "./comparators";

export const fetchNextModelFactory = (
  sources: LanguageModelSourceLevelConfigResponse[]
): LanguageModelOrchestrationListFunction => {
  if (sources.length === 0) throw new Error('No sources provided.');
  return async ({
    attempts,
    excluded,
    logApi, operation, preferred,
  }): Promise<LanguageModelProps | undefined> => {
    // Grab the ideal operation models.
    try {
      const operationSummary = await llmReadOperationSummary(operation);

      // TODO: I think we may need to persist the model-level data.
      // That way we can very easily keep a simple number of runs and a
      // classification against each.
      // Then we can easily pick our next experimental and stable models.
      // We can also very easily pick when we have no models left with no data.
      // Maybe we can consider whether a "first-impression" model is a good
      // choice.
      if (operationSummary) {
        const useStable = attempts > 0;
        const model = useStable ? operationSummary.stable : operationSummary.experimental;
        // TODO: We can skip this if we are excluding it.
        logApi.setStatus(
          'information',
          `Found operation summary. Using ${useStable ? 'stable' : 'experimental'} model: ${model.source} ${model.name}`
        );
        preferred.push(model);
      }

      // Get all possible models.
      const sourced = await fetchModels({
        excluded, logApi, preferred, sources
      });

      // TODO: This is probably a good time to filter non-local models if the
      // internet is unavailable.

      // If we have run out of models, we simply return.
      if (sourced.length === 0) return;

      // TODO: Earlier in the function we should probably generate the
      // comparison function based on the level of internet reliability and
      // whether the function is local. For now, we can prioritise local
      // models when the internet reliability is low or looks like its about
      // to fall off.

      // Flatten, sort and select the top.
      const sorted = sourced.flat().filter(
        ({ priority }) => priority !== 'excluded'
      ).sort(compareLanguageModels);

      return sorted[0];
    } catch (e) {
      // TODO: Might be worth checking for different types of return for
      // different errors. Later.
      return;
    }
  }
};

// type ParameterValue = 'preferred' | 'required';
// type ModelParameters = {
//   [K in keyof Partial<LanguageModelProps>]: {
//     type: ParameterValue;
//     value: LanguageModelProps[K];
//   };
// };
// const computeParameters = (): ModelParameters => {
//   // If no internet, local is a requirement. Need to find internet.
//   // If no system resources, remote is the preference.
//   // If no internet OR system resources, should probably check with the user first. Would ideally looking into ensuring it doesn't eat the whole processor, but just waits until available or something.
// };

// TODO:
// Would also like to train a model based on operation name, model config (e.g.
// gemini/flash, etc), system capacity availability (e.g. whether there is
// internet). For here, however, all that would simply be stored. Perhaps local
// database orchestration is worth doing first.
// In any case, the model selection will choose the next (non-excluded) model
// based on the parameters.
