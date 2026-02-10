import { firestore } from "firebase-admin";
import { getFirebaseDb } from "../../libs/firebase";
import { TypesaurusCore } from "typesaurus";
import { TsCollectionDef, TsDoc } from "../../libs/typesaurus";

/**
 * @Deprecated Use typesaurus schemas instead.
*/
export const collectionFactory = <T extends { [x: string]: unknown; }>(
  collectionName: string,
  converter: {
    from: (snapshot: firestore.QueryDocumentSnapshot) => T;
    to?: (data: firestore.PartialWithFieldValue<T> | firestore.WithFieldValue<T>) => firestore.DocumentData;
  }
): () => firestore.CollectionReference<T, firestore.DocumentData> => {
  const fbConverter: firestore.FirestoreDataConverter<T> = {
    fromFirestore: converter.from,
    toFirestore: converter.to ? converter.to : (obj) => obj,
  };

  return () => getFirebaseDb()
    .collection(collectionName)
    .withConverter(fbConverter);
};

export const cleanExistingFactory = <T extends { id: string; }>(initialise: () => Omit<T, 'id'>) => (
  snapshot: firestore.QueryDocumentSnapshot<T>
): T => {
  const data = snapshot.data();
  return {
    ...initialise(),
    ...data,
    id: snapshot.id,
  };
};

export const reduceFetchManyFactory = <
  CollectionName extends string,
  ModelType extends TypesaurusCore.ModelType,
  Id extends TypesaurusCore.Id<CollectionName> = TypesaurusCore.Id<CollectionName>,
>(ids: Id[]) => <
  CollectionDef extends TsCollectionDef<CollectionName, ModelType>
    = TsCollectionDef<CollectionName, ModelType, false, false, false>,
  Doc extends TsDoc<CollectionDef> = TsDoc<CollectionDef>,
  Acc extends {
    map: Map<TypesaurusCore.Id<CollectionName>, Doc>,
    notFound: Id[],
  } = {
    map: Map<Id, Doc>,
    notFound: Id[],
  }
>(
  acc: Acc,
  doc: Doc | null,
  i: number
): Acc => doc
  ? { ...acc, map: acc.map.set(doc.ref.id, doc) }
  : { ...acc, notFound: [...acc.notFound, ids[i]] };

export const docsReduction = <
  CollectionName extends string,
  ModelType extends TypesaurusCore.ModelType,
  Id extends TypesaurusCore.Id<CollectionName> = TypesaurusCore.Id<CollectionName>,
  CollectionDef extends TsCollectionDef<CollectionName, ModelType, boolean, false, false>
    = TypesaurusCore.CollectionDef<CollectionName, ModelType, false, false, false>,
  Doc extends TsDoc<CollectionDef> = TsDoc<CollectionDef>,
>(ids: Id[], docs: (Doc | null)[]) => docs.reduce(
  (acc, doc, i) => doc
    ? { ...acc, map: acc.map.set(doc.ref.id, doc) }
    : { ...acc, notFound: [...acc.notFound, ids[i]] },
  {
    map: new Map<TypesaurusCore.Id<CollectionName>, TsDoc<CollectionDef>>(),
    notFound: [],
  },
);

export const fetchMany = async <
  CollectionName extends string,
  ModelType extends TypesaurusCore.ModelType,
  Id extends TypesaurusCore.Id<CollectionName> = TypesaurusCore.Id<CollectionName>,
  CollectionDef extends TsCollectionDef<CollectionName, ModelType, boolean, false, false>
    = TypesaurusCore.CollectionDef<CollectionName, ModelType, false, false, false>,
>(
  collection: TypesaurusCore.Collection<CollectionDef>,
  ids: Id[],
) => {
  const docs = await collection.many(ids);
  return docsReduction<CollectionName, ModelType, Id, CollectionDef, TsDoc<CollectionDef>>(ids, docs);
};
