import { useEffect, useState } from "react";

export const usePersistent = <T>(key: string) => {
  const [item, setItem] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(item));
  }, [item]);

  return {
    item,
    setItem,
  };
};
