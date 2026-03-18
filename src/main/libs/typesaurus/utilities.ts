import { IdProp } from "../../../shared/lib/typesaurus";

// These functions are primarily for handling a TypesaurusCore.Doc type, but
// the actual type is very convoluted, so we use an approximation of the
// relevant properties here.

type WithId<T extends object = object> = T & IdProp<string>;

type Doc<T extends WithId> = { data: Omit<T, 'id'>; ref: { id: T['id'] } };

export const docMap = <T extends WithId>(
  doc: Doc<T>
): T => ({ ...doc.data, id: doc.ref.id }) as T;

export const docsMap = <
  T extends WithId,
>(docs: (Doc<T> | null)[]) => docs.reduce(
  (acc, doc) => {
    if (!doc) return acc;
    const mapped = docMap(doc);
    return [
      ...acc,
      mapped,
    ];
  },
  []
);
