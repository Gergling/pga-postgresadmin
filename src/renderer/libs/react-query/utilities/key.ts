import { ArchetypeDefault } from "../../../../shared/lib/typesaurus";

export const getCollectionKey = <
  Archetype extends ArchetypeDefault,
  CollectionName extends Archetype['collectionName'],
  Id extends Archetype['id'][CollectionName],
>(
  collectionName: CollectionName,
  id?: ArchetypeDefault['id'][Id]
) => {
  if (id === undefined) return [collectionName];
  return [collectionName, id];
};
