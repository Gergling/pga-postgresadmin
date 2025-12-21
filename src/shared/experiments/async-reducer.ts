const asyncReducer = async <
  State,
  Action,
>(
  items: Action[],
  reducer: (
    state: State | undefined,
    action: Action,
    currentIndex: number,
    items: Action[],
  ) => Promise<State>,
  initialValue?: State
): Promise<State> => {
  if (items.length === 0) {
    if (initialValue) return initialValue;

    throw new Error('No items and no initial value');
  }

  let updatedValue = initialValue;
  for (const index in items) {
    const item = items[index];
    updatedValue = await reducer(updatedValue, item, +index, items);
  }

  return updatedValue as State;
};
