import { useEffect } from "react";

type UseFocusProps = {
  handleBlur?: EventListener;
  handleFocus?: EventListener;
};

export const useFocus = ({
  handleBlur, handleFocus
}: UseFocusProps) => useEffect(() => {
  // Add listeners when component mounts
  handleFocus && window.addEventListener('focus', handleFocus);
  handleBlur && window.addEventListener('blur', handleBlur);

  // Clean up listeners when component unmounts
  return () => {
    handleFocus && window.removeEventListener('focus', handleFocus);
    handleBlur && window.removeEventListener('blur', handleBlur);
  };
}, []);
