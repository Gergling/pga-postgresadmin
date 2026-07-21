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
import z from 'zod';
import { log } from '@/main/shared';

type Listener<T> = (data: T | T[]) => unknown;

type SchemaViolationPolicyAction<T> = 'delete' | T | 'ignore';

type SchemaViolation<T> = {
  record: T;
  error: z.ZodError<T>;
}
type SchemaViolationPolicyParams<T> = SchemaViolationPolicyAction<T> | ((
  props: SchemaViolation<T>, idx: number
) => SchemaViolationPolicyAction<T>)

// TODO: Given the requirements of Datastore, I am a bit surprised it lets me
// only contrain to object.
export class NeDbWrapper<T extends object> {
  collectionName: string;
  db: Datastore<T>;
  listeners: Listener<T>[];

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.db = new Datastore<T>({
      autoload: true, filename: getNeDbFileName(collectionName),
    });
    this.listeners = [];

    log(`Initialising NeDb collection for ${collectionName}`);
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

  async findSchemaViolators(
    schema: z.ZodType<T>
  ): Promise<SchemaViolation<T>[]> {
    const all = await this.db.findAsync({});
    return all.reduce((violators, record) => {
      const x = schema.safeParse(record);
      if (x.success) return violators;
      return [...violators, { record, error: x.error }];
    }, [] as SchemaViolation<T>[]);
  }
  // TODO: What would we do about schema violations?
  // Custom function?
  // Update?
  // Deletion?
  async fixSchemaViolations(
    schema: z.ZodType<T>,
    policy: SchemaViolationPolicyParams<T>
  ) {
    // Perhaps it assumes T could be a function.
    const policyFn = typeof policy === 'function'
      ? policy
      : () => policy;
    const violations = await this.findSchemaViolators(schema);
    const report = { removed: 0, updated: 0 };
    violations.forEach(async (violation, idx) => {
      const { record } = violation;
      const action = policyFn(violation, idx);
      if (action === 'delete') {
        const removed = await this.db.removeAsync(record, { multi: false });
        report.removed += removed;
        return;
      }
      if (action === 'ignore') return;

      // Otherwise, we can assume the function 
      const { numAffected } = await this.db.updateAsync(record, action, { multi: false });
      report.updated += numAffected;
    });
    return report;
  }

  compact() {
    return this.db.compactDatafileAsync();
  }
};

export const instantiateNeDbWrapper = <T extends object>(
  collectionName: string
) => new NeDbWrapper<T>(collectionName);
