import {
  LanguageModelSourceLevelResponse,
  log,
} from "@/main/shared";

export const catchGeminiError = (
  caught: unknown,
  model: string,
): LanguageModelSourceLevelResponse => {
  if (typeof caught !== 'object' || caught === null) throw caught;

  // If we can break down the error, we do, or we just throw.
  if ('status' in caught) {
    switch(caught.status) {
      case 503: return {
        model,
        status: 'traffic',
      };
      case 429: 
      log('Gemini called too many times (429). Handling may require nuance.', 'error');
      console.error(caught);
      return {
        model,
        status: 'rate-limitations',
      };
    }
  } else {
    console.error(`No status code available. Needs a handler.`);
  }

  if ('error' in caught) {
    console.error(`Caught object contained an error property which will need a handler:`);
    console.error(caught.error);
  } else {
    console.error(`No error property available. Needs a handler.`);
  }

  log(`Available error object keys:`, 'error');
  console.error(Object.keys(caught))

  throw caught;
}
