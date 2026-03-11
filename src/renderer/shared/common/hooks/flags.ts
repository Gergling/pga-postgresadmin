import { useMemo, useReducer } from "react";

export const useFlags = <
  Key extends string | number | symbol,
>(initialState: Record<Key, boolean>) => {
  const [flags, dispatch] = useReducer((
    state: { key: Key, value: boolean; }[],
    action: { key: Key; value: boolean | 'toggle'; },
  ) => state.map(({ key, value }) => {
    if (key === action.key) return { key, value: action.value === 'toggle' ? !value : action.value };
    return { key, value };
  }), Object.entries<boolean>(initialState).map(([key, value]) => ({ key: key as Key, value })));

  const { off, on } = useMemo(() => {
    console.log('flags', flags)
    return flags.reduce(({ off, on }, { key, value }) => {
      if (value) return { off, on: [...on, key] };
      return { off: [...off, key], on };
    }, {
      off: [],
      on: [],
    });
  }, [flags]);

  const set = (key: Key) => {
    console.log('setting', key, off, on, flags)
    dispatch({ key, value: true });
  };
  const clear = (key: Key) => {
    dispatch({ key, value: false });
  };
  const toggle = (key: Key) => {
    dispatch({ key, value: 'toggle' });
  };
  const get = (key: Key) => flags.find((flag) => flag.key === key)?.value ?? false;

  return { clear, get, off, on, set, toggle };
};
