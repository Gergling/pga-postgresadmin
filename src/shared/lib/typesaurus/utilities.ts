import { schema, TypesaurusCore } from "typesaurus";
import { ArchetypeDefault, ArchetypeDoc, DbSchemaDefault } from "./types";

// TODO: Concerns DB-specific things, and should therefore probably go in the main thread.
export const createSchema = <T extends DbSchemaDefault>(
  collectionNames: T['collectionName'][]
): TypesaurusCore.DB<T['record']> => schema<T['record'], TypesaurusCore.Options>(
  ($) => collectionNames.reduce((acc, collectionName) => ({ ...acc, [collectionName]: $.collection() }), {})
);

export const createQueryList = <
  Archetype extends ArchetypeDefault,
  CollectionName extends Archetype['collectionName']
>(models: ArchetypeDoc<Archetype['_registry'][CollectionName]>[]) => models.map(({
  data,
  ref: { id }
}): Archetype['_registry'][CollectionName]['base'] => ({
  ...data,
  id,
}));

export const createQueryMap = <
  Archetype extends ArchetypeDefault,
  CollectionName extends Archetype['collectionName']
>(models: ArchetypeDoc<Archetype['_registry'][CollectionName]>[]) => new Map(
  createQueryList(models).map(({ id, ...data }) => [id, data])
);
