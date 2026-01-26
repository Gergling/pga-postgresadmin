export const getGeometryGroup = (
  id: string,
  children: React.ReactNode
) => <g id={id} transform="translate(50, 50)">{children}</g>;
