import { useEffect, useRef } from 'react';

export const useInactivityDebounce = (callback: () => void, delay = 30000) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  useEffect(() => {
    // Listen for any interaction within the app
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Initial start
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [callback, delay]);

  return timerRef;
};
