import Datastore from '@seald-io/nedb';

export type FindOneArgs = [query: any] | [query: any, projection: any];
export function findOne<T>(
  db: Datastore<T>, ...args: FindOneArgs
) {
  const [query, projection] = args;
  return new Promise<T | null>((resolve, reject) => {
    const callback = (err: Error | null, doc: T | null) => {
      if (err) return reject(err);
      resolve(doc);
    };
    if (projection) {
      db.findOne(query, projection, callback);
    } else {
      db.findOne(query, callback);
    }
  });
};

export type InsertArgs<T> = T | T[];
export const insert = async <T>(
  db: Datastore<T>, data: InsertArgs<T>
): Promise<InsertArgs<T>> => new Promise<InsertArgs<T>>((resolve, reject) => {
  const callback = <U extends InsertArgs<T>>(err: Error | null, doc: U) => {
    if (err) return reject(err);
    resolve(doc);
  };
  if (Array.isArray(data)) {
    db.insert(data, callback<T[]>);
  } else {
    db.insert(data, callback<T>);
  }
});

export type UpdateArgs<T> = Parameters<Datastore<T>['update']>;
export const update = async <T>(
  db: Datastore<T>, ...args: UpdateArgs<T>
) => new Promise<number>((resolve, reject) => {
  const callback: UpdateArgs<T>[3] = (
    err, numberOfUpdated, affectedDocuments, upsert
  ) => {
    if (err) return reject(err);
    resolve(numberOfUpdated);
  };
  const [query, updateQuery, options] = args;
  db.update(query, updateQuery, options, callback);
});
