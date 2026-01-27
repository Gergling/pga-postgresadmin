import { useMemo } from "react";

export const getGeometryGroup = (
  id: string,
  translation: number,
  children: React.ReactNode
) => {
  const transform = useMemo(() => `translate(${translation}, ${translation})`, [translation]);
  return <g id={id} transform={transform}>{children}</g>;
};
