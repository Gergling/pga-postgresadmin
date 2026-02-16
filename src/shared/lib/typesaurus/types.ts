import { TypesaurusCore } from "typesaurus";

export type InferCollectionName<T> = T extends TypesaurusCore.Id<infer C> ? C : never;

// Helper to define what we need for each collection
type ArchetypeEntry = { base: object; model: object; };

// The "Engine" - This processes a single entry into all its variations
export type ArchetypeMapEntry<Name extends string, E extends ArchetypeEntry> = {
  base: E['base'] & { id: TypesaurusCore.Id<Name> };
  id: TypesaurusCore.Id<Name>;
  model: E['model'];
  collections: TypesaurusCore.PlainCollection<E['model'], false, false>;
  name: Name;
};
export type ArchetypeMapEntryDefault = ArchetypeMapEntry<string, ArchetypeEntry>;

export type Archetype<T extends Record<string, ArchetypeEntry>> = {
  // We map once to create a hidden "Registry" of all processed shapes
  _registry: {
    [K in keyof T & string]: ArchetypeMapEntry<K, T[K]>;
  };
  
  // Now we just pluck the specific category we want
  base: { [K in keyof T & string]: Archetype<T>['_registry'][K]['base'] };
  id: { [K in keyof T & string]: Archetype<T>['_registry'][K]['id'] };
  modelType: { [K in keyof T & string]: Archetype<T>['_registry'][K]['model'] };
  collections: { [K in keyof T & string]: Archetype<T>['_registry'][K]['collections'] };
  
  // Metadata
  collectionName: keyof T;
};

export type ArchetypeDefault = Archetype<Record<string, ArchetypeEntry>>;

// Get doc from an archetype collection model
export type ArchetypeDoc<M extends ArchetypeMapEntryDefault> = TypesaurusCore.Doc<
  TypesaurusCore.CollectionDef<
    M['name'],
    M['model'],
    false, false, false
  >,
  TypesaurusCore.DocProps & {
    environment: TypesaurusCore.RuntimeEnvironment;
  }
>;
