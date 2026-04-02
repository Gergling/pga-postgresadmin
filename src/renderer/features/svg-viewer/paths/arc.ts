import { Point } from "../types";

// type ArcPathPropsBase = {
//   largeArc?: boolean;
//   sweep?: boolean;
// };

type ArcPathPropsMove = { move?: Point; };

type ArcPathPropsQuadratic = ArcPathPropsMove & {
  control: Point;
  delta?: boolean;
  target: Point;
};

const arcPathQuadratic = (
  {
    control,
    delta = false,
    move,
    target,
  }: ArcPathPropsQuadratic,
) => {
  const movePath = move ? `M ${move.x} ${move.y}` : '';
  const path = `${control.x} ${control.y}, ${target.x} ${target.y}`;
  const q = delta ? 'q' : 'Q';
  return [
    movePath,
    q, path,
  ].join(' ');
};

// type ArcPathPropsCartesian = ArcPathPropsBase & {
//   radius: number;
//   rotation?: number;
//   target: Point;
// };

// const arcPathCartesian = ({
//   move,
//   radius,
//   rotation = 0, // Could switch this out for a start/end object
//   largeArc = false,
//   sweep = false,
//   target,
// }: {
//   move?: Point;
//   target: Point;
//   radius: Point | number;
//   rotation?: number | { start: number; end: number; };
//   largeArc?: boolean;
//   sweep?: boolean;
// }) => {
//   const singleRadius = typeof radius === 'number';
//   const radiusX = singleRadius ? radius : radius.x;
//   const radiusY = singleRadius ? radius : radius.y;
//   return [
//     move ? `M ${move.x},${move.y}` : '',
//     `A ${radiusX},${radiusY} ${rotation} ${largeArc ? 1 : 0},${sweep ? 1 : 0} ${target.x},${target.y}`,
//   ];
// };

// type ArcPathPropsPolar = ArcPathPropsBase & ArcPathPropsMove & {
//   centre: Point;
//   radius: number;
//   rotation?: {
//     start: number;
//     end: number;
//   };
// }
// const arcPathPolar = (
//   {
//     centre: { x, y },
//     largeArc = false,
//     radius,
//     rotation,
//     sweep,
//   }: ArcPathPropsPolar,
//   startAngle: number,
//   endAngle: number,
// ) => {
//   const start = polarToCartesian(x, y, radius, endAngle);
//   const end = polarToCartesian(x, y, radius, startAngle);

//   // If the arc is greater than 180 degrees, the 'large-arc-flag' must be 1.
//   const largeArcFlag = largeArc ? "1" : "0";

//   return [
//     "M", start.x, start.y, 
//     "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
//   ].join(" ");
// };

type ArcPathProps =
  // | ArcPathPropsCartesian
  | ArcPathPropsQuadratic
;

export const arcPath = (props: ArcPathProps) => {
  return arcPathQuadratic(props);
};
