import { AtomicReport, ReportAggregatorParams } from "../types";

export const atomise = (
  {
    groups,
    report
  }: ReportAggregatorParams
): AtomicReport[] => {
  return Object.entries(report).reduce<AtomicReport[]>((acc, [_, { lines, src, visibility: visibilityStatus }]) => {
    return lines.reduce<AtomicReport[]>((acc, lineAggregates, line) => {
      return Object.entries(lineAggregates).reduce<AtomicReport[]>(
        (acc, [aggregation, value]) => {
          const visibility = visibilityStatus[aggregation];
          const group = groups[aggregation];
          return [
            ...acc,
            {
              aggregation,
              group,
              line,
              src,
              value,
              visibility
            }
          ];
        },
        acc
      );
    }, acc);
  }, []);
};

export const aggregate = (
  atomised: AtomicReport[]
) => {
  atomised.reduce<{
    atomisedByFile: Record<string, AtomicReport[]>;
    atomisedByGroupVisibility: Record<string, AtomicReport[]>;
    atomisedByVisibility: Record<string, AtomicReport[]>;
  }>(
    (acc, atom) => {
      return {
        atomisedByFile: {
          ...acc.atomisedByFile,
          [atom.src]: [
            ...acc.atomisedByFile[atom.src] || [],
            atom,
          ],
        },
        atomisedByGroupVisibility: {
          ...acc.atomisedByGroupVisibility,
          [atom.visibility + '-' + atom.group]: [
            ...acc.atomisedByGroupVisibility[atom.visibility + '-' + atom.group] || [],
            atom,
          ],
        },
        atomisedByVisibility: {
          ...acc.atomisedByVisibility,
          [atom.visibility]: [
            ...acc.atomisedByVisibility[atom.visibility] || [],
            atom,
          ],
        },
      };
    }, {
      atomisedByFile: {} as Record<string, AtomicReport[]>,
      atomisedByGroupVisibility: {} as Record<string, AtomicReport[]>,
      atomisedByVisibility: {} as Record<string, AtomicReport[]>,
    }
  );
}

type GetKey<T extends {}> = (props: T) => keyof T;

type AggregationOption<
  TObject extends {},
  TKey extends keyof TObject
> = {
  getKey: GetKey<TObject>,
  getValues: (props: TObject) => Record<TKey, TObject[]>
};
type AggregationOptions<
  TObject extends {},
  TByKey extends string,
  TKey extends keyof TObject
> = Record<TByKey, AggregationOption<TObject, TKey>>;

type AggregationAccumulation<
  TObject extends {},
  TByKey extends string,
  TKey extends keyof TObject
> = Record<TByKey, Record<TKey, TObject[]>>;

export const aggregate2 = <
  TObject extends {},
  TByKey extends string,
  TKey extends keyof TObject
>(
  atomised: TObject[],
  options: AggregationOptions<TObject, TByKey, TKey>,
) => {
  const optionEntries = Object.entries<
    AggregationOption<TObject, TKey>
  >(options).map(([byKeyStr, { getKey, getValues }]) => ({
    byKey: byKeyStr as TByKey,
    getKey,
    getValues
  }));
  const initial = optionEntries.reduce((acc, { byKey }) => ({
    ...acc,
    [byKey]: {}
  }), {} as AggregationAccumulation<TObject, TByKey, keyof TObject>);
  const mapped = atomised.reduce<AggregationAccumulation<TObject, TByKey, keyof TObject>>(
    (acc, atom) => {
      return optionEntries.reduce<
        AggregationAccumulation<TObject, TByKey, keyof TObject>
      >(
        (acc, { byKey, getKey, getValues }) => {
          const key = getKey(atom);
          return {
            ...acc,
            [byKey]: {
              ...acc[byKey],
              [key]: [
                ...((acc[byKey] || {})[key] || []),
                atom,
              ],
            },
          };
        },
        acc
      );
    }, initial
  );
}
