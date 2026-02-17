import { schema, TypesaurusCore } from "typesaurus";
import { ArchetypeDefault, ArchetypeDoc, ArchetypeMapEntryDefault } from "./types";

export const createSchema = <T extends ArchetypeDefault>(
  collectionNames: T['collectionName'][]
): TypesaurusCore.DB<T['collections']> => schema<T['collections'], TypesaurusCore.Options>(
  ($) => collectionNames.reduce((acc, collectionName) => ({ ...acc, [collectionName]: $.collection() }), {})
);

export const createCollectionMap = <
  T extends ArchetypeMapEntryDefault,
>() => new Map<T['id'], T['base']>();

export const docsReduction = <
  T extends ArchetypeMapEntryDefault,
>(ids: T['id'][], docs: (ArchetypeDoc<T> | null)[]) => docs.reduce(
  (acc, doc, i) => doc
    ? { ...acc, map: acc.map.set(doc.ref.id, doc) }
    : { ...acc, notFound: [...acc.notFound, ids[i]] },
  {
    map: new Map<T['id'], ArchetypeDoc<T>>(),
    notFound: [],
  },
);
