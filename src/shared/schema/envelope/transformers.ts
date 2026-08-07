import { Temporal } from "@js-temporal/polyfill";
import { nowUtcZdt } from "@/shared/utilities";

/**
 * 
 * @param existing 
 * @param update 
 * @deprecated There's a simpler function about reducing object changes
 * somewhere.
 * @todo This function needs to be given the last persisted data and the changes
 * to provide the latest audit entry. The latest audit entry will have the
 * existing values for the changed keys. The changed values don't need to be
 * used.
 * @returns 
 */
export const transformEnvelopeAudit = <
  D extends object,
  E extends {
    audit: { data: Partial<D>; updated: Temporal.ZonedDateTime; }[]; data: D;
  }
>(existing: E, update: Partial<D>): {
  after: E;
  before: E;
  changes: Partial<D>;
} => {
  const { after, changes } = Object.keys(existing.data).reduce(
    (acc, key) => {
      const dKey = key as keyof D;
      const existingValue = (acc.after)[dKey];
      const updatedValue = update[dKey];

      if (updatedValue === undefined || existingValue === updatedValue) return acc;

      return {
        after: {
          ...acc.after,
          [key]: updatedValue ?? existingValue,
        },
        changes: { ...acc.changes, [key]: updatedValue }
      };
    },
    { after: existing.data, changes: {} } as {
      after: D; changes: Partial<D>;
    }
  );

  const updated = nowUtcZdt();
  const audit = [{ data: changes, updated }, ...existing.audit];

  return {
    after: { ...existing, audit, data: after },
    before: existing,
    changes,
  };
};
