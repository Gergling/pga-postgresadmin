import { TypesaurusCore } from "typesaurus";
import { Mandatory, Optional } from "../../../shared/types";

export type InferCollectionName<T> = T extends TypesaurusCore.Id<infer C> ? C : never;

// Helper to define what we need for each collection
type ArchetypeEntry = { base: object; model: object; };

type ArchetypeMapEntryBase<
  Base extends object,
  Name extends string,
> = Base & { id: TypesaurusCore.Id<Name>; };

// The "Engine" - This processes a single entry into all its variations
/**
 * @deprecated Use SchemaCollectionProps instead.
 */
export type ArchetypeMapEntry<Name extends string, E extends ArchetypeEntry> = {
  /**
   * @deprecated Use the Transfer type instead.
   */
  base: ArchetypeMapEntryBase<E['base'], Name>;
  /**
   * @deprecated Use the Transfer type instead.
   */
  id: TypesaurusCore.Id<Name>;
  model: E['model'];
  collections: TypesaurusCore.PlainCollection<E['model'], false, false>;
  name: Name;
};
/**
 * @deprecated Probably should be using SchemaCollectionProps instead.
 */
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

/**
 * @deprecated Use Schema or DbSchema instead.
 */
export type ArchetypeDefault = Archetype<Record<string, ArchetypeEntry>>;

// This is generally for when the object is being created but doesn't necessarily have an id yet.
/**
 * @deprecated Probably use a SchemaCollection or Creation type... IDK.
 */
export type ArchetypeMapEntryBaseFlux<
  ArchetypeMapEntry extends ArchetypeMapEntryDefault
> = Optional<ArchetypeMapEntry['base'], 'id'>;

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

type CollectionNameKey = string | symbol | (string | symbol)[];

export type IdProp<CollectionName extends CollectionNameKey> = { id: TypesaurusCore.Id<CollectionName>; };
export type WithId<CollectionName extends CollectionNameKey> = object & IdProp<CollectionName>;

export type OptionalId<T extends object & Partial<IdProp<CollectionNameKey>>> = Optional<T, 'id'>;

export type TransferUpdate<T extends IdProp<CollectionNameKey>> = Mandatory<T, 'id'>;

export type CollectionId<CollectionNames extends string> = {
  [K in CollectionNames]: TypesaurusCore.Id<K>;
}

export type Summary<
  PersistentCollection extends IdProp<CollectionNameKey>,
  Props extends keyof Omit<PersistentCollection, 'id'>
> = Pick<PersistentCollection, 'id' | Props>;

// We need to associate the persistent type, the id brand (collectionName), and the associated collections.
// This is to safely-type a schema run.
export type SchemaCollectionProps<
  CollectionName extends string,
  Schema extends object,
> = {
  name: CollectionName;
  persistent: Schema & IdProp<CollectionName>;
  schema: Schema;
};
export type SchemaCollectionPropsDefault = SchemaCollectionProps<string, object>;

export type Schema<T extends Record<string, object> = Record<string, object>> = {
  // We map once to create a hidden "Registry" of all processed shapes
  _registry: {
    [K in keyof T & string]: SchemaCollectionProps<K, T[K]>;
  };

  collectionName: keyof T;
  id: { [K in keyof T & string]: Schema<T>['_registry'][K]['persistent']['id'] };
  persistent: { [K in keyof T & string]: Schema<T>['_registry'][K]['persistent'] };
};
export type SchemaDefault = Schema<Record<string, object>>;

export type DbSchema<
  PersistentGroup extends Schema,
  RecordGroup extends Record<PersistentGroup['collectionName'], object>
> = PersistentGroup & {
  record: {
    [K in keyof RecordGroup & string]: TypesaurusCore.PlainCollection<
      Omit<RecordGroup[K], 'id'>,
      false,
      false
    >
  };
};

export type DbSchemaDefault = DbSchema<Schema, Record<string, object>>;

// Get doc from an archetype collection model
export type SchemaCollectionDoc<SchemaCollection extends SchemaCollectionProps<string, object>> = TypesaurusCore.Doc<
  TypesaurusCore.CollectionDef<
    SchemaCollection['name'],
    SchemaCollection['schema'],
    false, false, false
  >,
  TypesaurusCore.DocProps & {
    environment: TypesaurusCore.RuntimeEnvironment;
  }
>;

export type SchemaCollectionDocDefault = SchemaCollectionDoc<SchemaCollectionProps<string, object>>;

export type CreateFunction<
  In extends object & { id?: never; },
  Out extends IdProp<string>,
> = (input: In) => Promise<Out>;

export type FetchItemFunction<
  In, Out
> = (input: In) => Promise<Out | null>;

export type FetchListFunction<
  In, Out
> = (input: In) => Promise<Out[]>;

export type UpdateFunction<
  In extends IdProp<string>,
  Out extends IdProp<string> = In
> = (input: TransferUpdate<In>) => Promise<TransferUpdate<Out>>;

export type MapFunction<
  In extends IdProp<string>,
  Out extends IdProp<string>,
> = (input: In) => Out;

export type SummariseFunction<
  In extends IdProp<string>,
  Out extends IdProp<string>
> = (input: In) => Out;
