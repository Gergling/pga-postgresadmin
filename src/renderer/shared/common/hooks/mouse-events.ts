import { useState, useEffect, useRef } from "react";

export function useElementMouseEvents<T extends Element>(
  initialElement?: T | null
) {
  const [isInside, setIsInside] = useState(false);
  const ref = useRef(initialElement ?? null);

  const onPointerEnter = () => setIsInside(true);
  const onPointerLeave = () => setIsInside(false);

  // 3. Bulletproof Fallback: Catch ultra-fast mouse flicks using a global
  // window listener
  useEffect(() => {
    // Only attach the global listener if React thinks the mouse is still inside
    if (!isInside) return;

    const handleGlobalMove = (event: PointerEvent) => {
      if (!ref.current) return;

      // Check if the physical element contains the thing the mouse is
      // currently hovering over
      if (event.target instanceof Node) {
        const isStillOverElement = ref.current.contains(event.target);

        if (!isStillOverElement) {
          setIsInside(false);
        }
      }
    };

    window.addEventListener("pointermove", handleGlobalMove);

    // Clean up listener when component unmounts or state changes
    return () => {
      window.removeEventListener("pointermove", handleGlobalMove);
    };
  }, [isInside]);

  return {
    isInside,
    props: {
      ref,
      onPointerEnter,
      onPointerLeave,
    },
  };
}
