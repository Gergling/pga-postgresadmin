import ollama from 'ollama';
import z from 'zod';
import {
  languageModelSourceLevelConfig,
} from "@/main/shared";

const errorSchema = z.object({ error: z.string() });

export const ollamaLanguageModelConfig = languageModelSourceLevelConfig({
  source: 'ollama',
  models: async () => {
    const { models } = await ollama.list();
    return models.map(({ name }) => ({
      local: true, name, thinking: undefined, temperature: undefined,
      tokenLimits: {},
    }));
  },
  generate: async ({ model, prompt, schema, temperature }) => {
    try {
      const gened = await ollama.generate({
        format: schema?.toJSONSchema(), model, prompt, options: {
          temperature
        },
      });

      return {
        canRetry: false,
        model,
        response: gened.response,
        status: 'success',
      };
    } catch (e) {
      const error = errorSchema.safeParse(e);
      if (error.success) return {
        canRetry: false,
        model,
        message: e.error,
        status: 'failed',
      };

      return {
        canRetry: false,
        model,
        message: e,
        status: 'failed',
      };
    }
    // const gened: {
    //     model: string;
    //     created_at: Date;
    //     response: string;
    //     thinking?: string | undefined;
    //     done: boolean;
    //     done_reason: string;
    //     context: number[];
    //     total_duration: number;
    //     load_duration: number;
    //     prompt_eval_count: number;
    //     prompt_eval_duration: number;
    //     eval_count: number;
    //     eval_duration: number;
    //     logprobs?: {
    //         top_logprobs?: {
    //             token: string;
    //             logprob: number;
    //         }[] | undefined;
    //         token: string;
    //         logprob: number;
    //     }[] | undefined;
    // }
    // Ollama’s API responses include metrics that can be used for measuring performance and model usage:
    // total_duration: How long the response took to generate
    // load_duration: How long the model took to load
    // prompt_eval_count: How many input tokens were in the prompt
    // prompt_eval_cached_count: How many prompt tokens were read from the cache
    // prompt_eval_duration: How long it took to evaluate the uncached prompt tokens
    // eval_count: How many output tokens were processes
    // eval_duration: How long it took to generate the output tokens
    // All timing values are measured in nanoseconds.
    // Promise<{
    //     model: string;
    // } & ({
    //     canRetry: false;
    //     message: string;
    //     status: "failed" | "unexpected";
    // } | {
    //     canRetry: true;
    //     status: "rate-limitations" | "traffic" | "parsing-incompatibility" | "string-retry";
    //     retryTimeout?: number | undefined;
    // } | {
    //     canRetry: false;
    //     response: string;
    //     status: "success";
    //     retryTimeout?: number | undefined;
    // })>
    // const response = await ollama.chat({
    //   model: 'llama3.2:3b', 
    //   messages: [{ 
    //     role: 'user', 
    //     content: `Write a git commit message for this diff:\n${gitDiff}` 
    //   }],
    //   options: {
    //     temperature: 0.6,
    //     num_ctx: 16384 // Explicitly sets the context window size in tokens
    //   }
    // });
  },
})