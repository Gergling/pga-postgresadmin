import { ArchetypeDefault, SchemaDefault } from "../../../../shared/lib/typesaurus";

/**
 * @deprecated Use getCollectionKeyFactory instead. Should be used at each feature level to supply a standardised key for IPC hooks.
 * @param collectionName 
 * @param id 
 * @returns 
 */
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

export const getCollectionKeyFactory = <Schema extends SchemaDefault>() => (
  collectionName: Schema['collectionName'],
  id?: Schema['id'][Schema['collectionName']]
) => {
  if (id === undefined) return [collectionName];
  return [collectionName, id];  
};
