import Datastore from '@seald-io/nedb';
import { SerialisationEnvelope } from '@/shared/schema';
import {
  findOne,
  FindOneArgs,
  getNeDbFileName,
  insert,
  InsertArgs,
  update,
  UpdateArgs
} from '../utilities';
import { dumpNeDb } from '../dump';

type Listener<T> = (data: T | T[]) => unknown;

export class NeDbWrapper<T> {
  collectionName: string;
  db: Datastore<T>;
  listeners: Listener<T>[];

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.db = new Datastore<T>({
      autoload: true, filename: getNeDbFileName(collectionName),
    });
    this.listeners = [];
  }

  addWriteListener(cb: (data: T) => unknown) {
    this.listeners.push(cb);
  }

  async findOne(...args: FindOneArgs) {
    return findOne(this.db, ...args);
  }

  async insert(data: T[]): Promise<{ inserted: T[]; }>;
  async insert(data: T): Promise<{ inserted: T; }>;
  async insert(data: T | T[]): Promise<{ inserted: T | T[]; }> {
    const inserted = await insert<T>(this.db, data);
    await dumpNeDb(this.collectionName);
    const report = this.listeners.map((listener) => {
      // listener(inserted);
    });
    return {
      inserted,
      // report,
    };
  }
  async update(...args: UpdateArgs<T>) {
    const updated = await update(this.db, ...args);
    await dumpNeDb(this.collectionName);
    const report = this.listeners.map((listener) => {
      // listener(updated);
    });
  }
};

export const instantiateNeDbWrapper = <T>(
  collectionName: string
) => new NeDbWrapper<T>(collectionName);
