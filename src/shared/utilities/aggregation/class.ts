import { mean, median } from "../maths";
import { Series } from "../maths/series";
import { aggregate } from "./utilities";

type AggregationFn<T> = (values: T[]) => number;
type GroupKeyFn<T> = (item: T) => PropertyKey;
type OrderFn<T> = (a: T, b: T) => number;

type Operation<T> = { name: string; } & (
  {
    type: 'aggregation'; fn: AggregationFn<T>;
  } | {
    type: 'group'; fn: GroupKeyFn<T>;
  } | {
    type: 'order'; fn: OrderFn<T>;
  }
);

// This is basically a class for wrapping the ultimate transformer of ultimate
// destiny.
// This is to make the patterns I find myself using a lot less repetitive.

export class Collection<T> extends Array<T> implements ArrayIterator<T> {
  static from<TData>(data: TData[]) {
    return new Collection<TData>(data);
  }
  // static Collection<T>(
  //   operand: { arr: T[]; },
  //   operations: Operation<T>
  // ) {

  // }

  private readonly data: T[];
  // private operations: Map<string, Operation<T>>;
  private aggregations: Map<string, number>;
  private groups: Map<PropertyKey, Map<PropertyKey, Collection<T>>>;
  // private cache: Map<string, Collection<T>>;

  constructor(data: T[]) {
    super();
    this.data = data;
    this.groups = new Map();
  }

  [Symbol.iterator](): ArrayIterator<T> {
    return this.data[Symbol.iterator]();
  }
  next(): IteratorResult<T> {
    return this.data[Symbol.iterator]().next();
  }

  // group(
  //   name: string, fn: GroupKeyFn<T>
  // ) {
  //   this.operations.set(name, { name, type: 'group', fn });
  //   return this;
  // }

  // order(
  //   name: string, fn: OrderFn<T>
  // ) {
  //   this.operations.set(name, { name, type: 'order', fn });
  //   return this;
  // }

  // aggregate(
  //   fn: AggregationFn<T>
  // ) {
  //   aggregate(this, fn);
  //   return this;
  // }

  add(...item: T[]) {
    this.data.push(...item);
    return this;
  }

  // group(fn: GroupKeyFn<T>) {
  //   const map = new Map<PropertyKey, Collection<T>>();
  //   this.forEach((item) => {
  //     const key = fn(item);
  //     const collection = map.get(key) ?? new Collection([]);
  //     map.set(key, collection.add(item));
  //   });
  //   this.groups.set(key, collection.add(item));
  //   return this;
  // }
  // operate(operation: Operation<T>) {
  //   switch (operation.type) {
  //     case 'aggregation':
  //       // Applies a function that calculates a number from array and assigns it
  //       // to the operation name.
  //       const aggregation = operation.fn(this);
  //       this.aggregations.set(operation.name, aggregation);
  //       return this;
  //     case 'group':
  //       // Groups a collection of items by a function that returns a key and
  //       // assigns it to the operation name.
  //       // const grouped = aggregate(this, operation.fn);

  //       // new Collection(grouped)
  //       this.groups.set(operation.name, grouped);
  //       return this;
  //     case 'order':
  //       return this.order(operation.fn);
  //   }
  // }
  // apply([operation, ...operations]: Operation<T>[]) {
  //   if (!operation) return this;

  //   operations.reduce((previous, operation) => {
  //     return this.operate(previous, operation);
  //   }, this);
  //   return this;
  // }
}

// Operation order:
// 1. Enrich/set keys etc.
// 2. Grouping
// 3. Summarisation
// 4. Ordering
const theCollection = Collection.from([
  { operation: 'commit-message', model: 'alpha', runtime: 10 },
  { operation: 'commit-message', model: 'alpha', runtime: 9 },
  { operation: 'commit-message', model: 'bravo', runtime: 8 },
  { operation: 'commit-message', model: 'bravo', runtime: 7 },
  { operation: 'task-triage', model: 'alpha', runtime: 6 },
  { operation: 'task-triage', model: 'alpha', runtime: 5 },
  { operation: 'task-triage', model: 'bravo', runtime: 4 },
  { operation: 'task-triage', model: 'bravo', runtime: 3 },
])
  // .apply([
  //   { type: 'group', name: 'operation', fn: ({ operation }) => operation },
  //   // Model grouping should be inside operation grouping.
  //   { type: 'group', name: 'model', fn: ({ model }) => model },
  //   // Should be able to name the summary the same as the group.
  //   // {
  //   //   type: 'summarise', name: 'model', fn: (items) => {
  //   //     const runtimes = items.map(({ runtime }) => runtime);
  //   //     return {
  //   //       count: items.length,
  //   //       mean: mean(runtimes),
  //   //       median: median(runtimes, true),
  //   //     };
  //   //   },
  //   // },
  //   // We need to summarise, but against the operation group, AFTER the .
  //   // { type: 'order', name: 'ascending-runtime', fn: (a, b) => a.runtime - b.runtime },
  // ])
  ;

// type Config<T, U> where U is the extension of data included.
// Enrichment may include this extension, resulting in groupings being able to
// access it.
type Config<T> = {
  // enrich?: Basically just a map. Extends the type, though.
  groups: Record<string, {
    key: GroupKeyFn<T>;
    config?: Config<T>;
  }>;
  summarise: AggregationFn<T>;
  // order?: OrderFn<T>;
};

// const config: Config<{
//   operation: string; model: string; runtime: number;
// }> = {
//   groups: {
//     operation: {
//       key: ({ operation }) => operation,
//       config: {
//         // Each operation should group by model.
//         groups: {
//           model: {
//             key: ({ model }) => model,
//             config: {
//               // All items for this model.
//               summarise: (items) => {
//                 const runtimes = items.map(({ runtime }) => runtime);
//                 const count = items.length;
//                 return {
//                   count, isExperimental: count < 5,
//                   mean: mean(runtimes),
//                   median: median(runtimes, true),
//                 };
//               }
//             }
//           }
//         },
//         // Each operation should order by model's summary data.
//         // order: (a, b) => {
//         //   // Experimentally ascending first.
//         //   if (a.summary.isExperimental !== b.summary.isExperimental) {
//         //     return a.summary.isExperimental ? -1 : 1;
//         //   }
//         //   // Otherwise, sort by ascending median.
//         //   return a.summary.median - b.summary.median;
//         // },
//         // Operation-level summary wants the most experimental items with the
//         // lowest runtimes.
//         summarise: (items) => {
//           // const runtimes = items.map(({ runtime }) => runtime);
//           items.reduce((acc, item) => {
//             if (item.isExperimental) {

//             }
//           }, { experimental, nonExperimental } as {
//             experimental?: T;
//             nonExperimental?: T;
//           })
//           return {
//             // count: items.length,
//             // mean: mean(runtimes),
//             // median: median(runtimes, true),
//           };
//         }
//       },
//     },
//   }
// };


const group = <T, U>(
  collection: Collection<T>, group: Config<T>['groups'][string],
) => {
  const map = new Map<PropertyKey, Collection<T>>();
  collection.forEach((item) => {
    const key = group.key(item);
    const collection = map.get(key) ?? new Collection([]);
    map.set(key, collection.add(item));
  });
  return map;
};
// Group by operation
// const operationMap = group(theCollection, config.groups.operation);
// Group by model
// We need to loop the operation map, and for each operation grouping, we need
// to group it by model.
// const modelMap = operationMap.forEach((item) => {
//   return group(item, config.groups.operation);
// });
// Summarise experimental, median and mean

// At the operation level, summarise the experimental, non-experimental and
// chosen model names.

