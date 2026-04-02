// For shared
// This could be derived from a config to avoid circular dependencies.
type Feature = 'diary' | 'task' | 'email';

type CrudKey = 'create' | 'read' | 'update' | 'delete';

// A single feature's shape
// We use 'any' or 'unknown' for the function signature here 
// because this is just the "Constraint"
export type FeatureMethods = Record<string, (...args: any[]) => any>;

export type CrudFeature = Partial<Record<CrudKey, FeatureMethods>>;

// Feature folders:
const taskCrud = {

};
const diaryCrud = {

};
const emailCrud = {

};


// Stay put:
export type FeatureRegistry = Record<Feature, CrudFeature>;

// const cruds = {
//   task: taskCrud,
//   diary: diaryCrud,
//   email: emailCrud,
// } satisfies FeatureRegistry;
