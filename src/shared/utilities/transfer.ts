// Utilities mapping between transfer types and other types.

export function toTransferDate(value: Date): number;
export function toTransferDate(value: Date | null): undefined;
export function toTransferDate(value: Date | null): number | undefined {
  if (!value) return undefined;
  return value.getTime();
}

export const fromTransferDate = (value: number | undefined): Date | null => {
  if (value === undefined) return null;
  return new Date(value);
};
