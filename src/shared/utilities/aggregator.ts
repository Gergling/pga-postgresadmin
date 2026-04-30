export const aggregate = <
  Item,
  AggregationKey extends PropertyKey
>(items: Item[], keyFunc: (item: Item) => AggregationKey) => {
  const map = new Map<AggregationKey, Item[]>();
  items.forEach((item) => {
    const key = keyFunc(item);
    const list = map.get(key) || [];
    map.set(key, [...list, item]);
  });
  return map;
};
