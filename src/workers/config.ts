// Example code

// Shared logic: Pure functions for CPU-bound tasks (The "Heavy Transformers")
// This will be a simple list of registered transformers.
// The transformers can be handled in separate files.
export const workerETLTransformers = {
  CLEANSE: (data: string) => data.replace(/[^a-zA-Z ]/g, ""),
  REVERSE: (data: string) => data.split('').reverse().join('')
};

// If the config gets long, these can be moved into a `types` file or folder.
export type TaskType = keyof typeof workerETLTransformers;

export interface ETLPayload {
  type: TaskType;
  docId: string;
  rawData: string;
}
