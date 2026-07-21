// Choose whether it audits and whether it syncs.

import { log, LogApi } from "@/main/shared";

const logApiPromise = log(
  'Initialising databases', async (logApi) => logApi
);

// Represents a single record, either real or potential.
// Schema is always serialisable.
class DatabaseCollection<T> {

  // audit: z.array(auditEnvelopeSchemaFactory(data, dateSchema)).default([]),
  // created: dateSchema.describe('This is the date when the data was wrapped.'),
  // data,
  // id: z.string().default(() => crypto.randomUUID()),
  // summary object
  // sync: z.number().optional().describe(
  //   'Last sync time in epochMilliseconds. Undefined means never synced.'
  // ),
  readonly logApiPromise: Promise<LogApi>;

  constructor(collectionName: string, options?: {
    auditable: boolean;
    remote: boolean;
  }) {
    if (options?.remote) {
      // Upsert meta for collection.
      // Could also do with a conflict resolution strategy (e.g. duplicate,
      // overwrite)
    }
    this.logApiPromise = logApiPromise.then(
      ({ log }) => log(`Initialised ${collectionName}`, async (logApi) => logApi)
    );
  }

  create(data: Partial<T>) {
    // Should pass in a callback for instantiating a DatabaseRecord
    // return new DatabaseRecord(this, data);
    throw new Error('Method not implemented.');
  }
}

class DatabaseRecord<T> {
  private logApiPromise: Promise<LogApi>;
  constructor(collection: DatabaseCollection<T>) {
  }
  private log(message: string, callback: (logApi: LogApi) => Promise<void>) {
    return this.logApiPromise.then(({ log }) => log(message, callback));
  }
  // could pass in an async callback and pass the local and remote collection db
  // into that
  callback(cb: (record: DatabaseRecord<T>, logApi: LogApi) => Promise<void>) {
    return this.log('Executing callback', (logApi) => cb(this, logApi));
  }
  query(params: string | Partial<T> | Partial<Envelope<T>>) {
    // Fetch local only.
    // If remote collection, log for querying to update restore strategy.
    return this.log('Querying', (logApi) => this.db.findAsync(params));
  }
  upsert(
    // query: string | Partial<T> | Partial<Envelope<T>>,
    // set: Partial<T>
  ) {
    // Created date generated here.
    // If auditing, updating an existing 
    // If remote, queue a sync.
    return this.log('Querying', (logApi) => this.db.findAsync(params));
  }
}
