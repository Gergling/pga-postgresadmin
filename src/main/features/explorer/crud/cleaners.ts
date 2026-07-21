import {
  ExplorerFileRecord,
  ExplorerFileRecordProps,
  explorerFileRecordSchema
} from "@/shared/features/explorer";
import { LogApi } from "@/main/shared";
import { explorerFileRecords } from "../schema";
import { readAllExplorerRecords } from "./records";

const db = explorerFileRecords.db;

// TODO: Redundant. Moving the logic to the ExplorerFileRecord class.
// Should check when reading the database.
export const cleanEFRSchemaViolations = ({ log }: LogApi) => log(
  'Fixing schema violations',
  async ({ setStatus }) => {
    const { removed, updated } = await explorerFileRecords.fixSchemaViolations(
      explorerFileRecordSchema, ({ error, record }, idx) => {
        const shouldRemove = error.issues.some((issue) => {
          if (issue.code === 'invalid_type') {
            if (issue.expected === 'string') {
              return issue.path.includes('parentPath') || issue.path.includes('name');
            }
          }
          return false;
        });
        if (shouldRemove) return 'delete';
        // if (idx < 10) console.log('VIOLATION', error, record)
        console.log('VIOLATION', error, record)
        return 'ignore';
      }
    );

    const message = [
      removed && `Removed ${removed} records.`,
      updated && `Updated ${updated} records.`,
      !(removed + updated) && 'No schema violations found',
    ].filter(Boolean).map((message) => `${message}`);
    setStatus(removed + updated > 0 ? 'warning' : 'information', message);
    return { removed, updated, total: removed + updated };
  }
);

// TODO: Redundant. Moving the logic to the ExplorerFileRecord class.
// Should check when reading the database.
export const cleanEFRMisformats = ({ log }: LogApi) => log(
  'Handling misformatted entries',
  async ({ log, setStatus }) => {
    const allRecords = await log(
      'Reading all explorer records', readAllExplorerRecords
    );
    // console.log('ALL', allRecords)
    const mismatches = allRecords.filter((result) => {
      const record = new ExplorerFileRecord(result);
      // console.log('RECORD', record)
      return result.parentPath !== record.data.parentPath
        || result.name !== record.data.name;
    });
    // console.log('MISMATCHES', mismatches)
    if (mismatches.length) {
      const removed = await Promise.all(mismatches.map(({ name, parentPath }) => {
        // const record = new ExplorerFileRecord(result);
        // const { name, parentPath } = record.data;
        return db.removeAsync({ name, parentPath }, { multi: true })
      }));
      const sum = removed.reduce((a, b) => a + b, 0);
      setStatus(
        'warning',
        `Removed ${sum} misformatted records`
      );
      return sum;
    } else {
      setStatus('information', 'No misformatted records found');
      return 0;
    }
  }
);

// TODO: Should only bother handling when reading the database by key.
// Needs relatively significant re-work.
export const cleanEFRDuplicates = ({ log }: LogApi) => log(
  'Handling duplicate keys (paths)',
  async ({ log, setStatus }) => {
    const all = await log('Reading all explorer records', readAllExplorerRecords);

    const { counts, duplicates } = all.reduce((acc, data) => {
      const key = `${data.parentPath}/${data.name}`;
      const count = (acc.counts[key] || 0) + 1;

      return {
        ...acc,
        counts: {
          ...acc.counts,
          [key]: count
        },
        duplicates: [...acc.duplicates, ...(count === 2 ? [data] : [])],
      };
    }, { counts: {} as Record<string, number>, duplicates: [] as ExplorerFileRecordProps[] });
    console.log('COUNT', counts)

    if (duplicates.length) {
      const sum = await log(
        `Removing ${duplicates.length} duplicate keys`,
        async ({ log, setStatus }) => {
          const sums = await Promise.all(
            duplicates.map(
              ({ name, parentPath }) => log(
                `${parentPath}/${name}`, () => db.removeAsync({ name, parentPath }, { multi: true })
              )
            )
          );
          const sum = sums.reduce((acc, sum) => acc + sum, 0);
          setStatus('warning', `Removed ${sum} duplicate records.`);
          return sum;
        }
      );
    } else {
      setStatus('information', 'No duplicate records found.');
    }

    return duplicates;
  }
);

export const cleanEFR = ({ log, setStatus }: LogApi) => log(
  'Cleaning Explorer File Records',
  async (logApi) => {
    const violations = await cleanEFRSchemaViolations(logApi);
    const misformats = await cleanEFRMisformats(logApi);
    const duplicates = await cleanEFRDuplicates(logApi);
    if (violations.total + misformats + duplicates.length > 0) {
      const comp = await log(
        'Compacting DB to handle updates',
        () => explorerFileRecords.compact()
      );
    } else {
      setStatus('information', 'No issues found.')
    }
    return { violations, misformats, duplicates };
  }
);