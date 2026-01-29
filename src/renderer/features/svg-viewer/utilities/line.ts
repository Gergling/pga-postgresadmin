import { Line, Orientation, Point } from "../types";
import { flipPoint, isPointZero, limitPointFactory, translatePoint } from "./point";
import { scalePoint } from "./scale";

export const flipLine = (line: Line, orientation: Orientation = 'horizontal'): Line => ({
  start: flipPoint(line.start, orientation),
  end: flipPoint(line.end, orientation),
});

export const getLineScalePoint = ({ start, end }: Line, scale: number): Point => ({
  x: ((end.x - start.x) * scale) + start.x,
  y: ((end.y - start.y) * scale) + start.y,
});

export const scaleLine = (scale: number) => ({ start, end }: Line): Line => ({
  start: scalePoint(start, scale),
  end: scalePoint(end, scale),
});

// In y = mx + c, this should be calculating c.
const getGradientOffset = (gradient: number) => ({ x, y }: Point) => y - (gradient * x);

export const limitLine = (scale = 1, cb: (line: Line, clippingPoint: Point) => boolean) => ({ start, end }: Line): Line => {
  const { getLimits, limitPoint } = limitPointFactory(scale);
  const startLimit = limitPoint(start);
  const endLimit = limitPoint(end);
  if (isPointZero(startLimit.exceeds) && isPointZero(endLimit.exceeds)) {
    return { start, end };
  }

  const delta: Point = {
    x: end.x - start.x,
    y: end.y - start.y,
  };

  if (isPointZero(delta)) {
    return { start: startLimit.limited, end: endLimit.limited };
  }

  if (delta.x === 0) {
    return {
      start: { x: start.x, y: startLimit.limited.y },
      end: { x: end.x, y: endLimit.limited.y },
    };
  }

  if (delta.y === 0) {
    return {
      start: { x: startLimit.limited.x, y: start.y },
      end: { x: endLimit.limited.x, y: end.y },
    };
  }

  const gradient = delta.y / delta.x;
  const yIntercept = start.y - gradient * start.x;

  const clipPoint = (p: Point): Point => {
    const pLimits = limitPoint(p);
    if (isPointZero(pLimits.exceeds)) {
      return p;
    }

    const newP = { ...p };

    // If x is out of bounds, clamp x and calculate y.
    if (pLimits.exceeds.x !== 0) {
      newP.x = pLimits.limited.x;
      newP.y = gradient * newP.x + yIntercept;
    }

    // Now, the new y might ALSO be out of bounds. Check it.
    const newPLimits = limitPoint(newP);
    if (newPLimits.exceeds.y !== 0) {
      newP.y = newPLimits.limited.y;
      // If we clamp y, we must recalculate x to stay on the line.
      if (gradient !== 0) {
        newP.x = (newP.y - yIntercept) / gradient;
      }
    }
    return newP;
  };

  return { start: clipPoint(start), end: clipPoint(end) };
};

export const mapLine = (point: Point, i: number, points: Point[]) => {
  const nextPoint = points[(i + 1) % points.length];
  const arc: Line = { start: point, end: nextPoint };
  return arc;
};

// export const reduceLineFactory = () => (acc: Line[], point: Point, i: number, points: Point[]) => {};
export const preProcessPointsReducerFactory = (
  cb: ({
    acc,
    current,
    previous,
    isFirst,
    i,
    points,
    // immutablePrevious,
  }: {
    acc: Point[];
    current: Point;
    previous: Point;
    isFirst: boolean;
    i: number;
    points: Point[];
    // immutablePrevious: Point;
  }) => Point[]
) => (
  acc: Point[], current: Point, i: number, points: Point[]
): Point[] => {
  // const previous = acc[acc.length - 1];
  const isFirst = acc.length === 0;
  const previous = points[i - 1];
  return cb({ acc, isFirst, current, i, previous, points });
};

export const getLinePath = ([move, ...lines]: Line[]): string => [
  `M ${move.start.x} ${move.start.y}`,
  ...lines.map((line) => `L ${line.end.x} ${line.end.y}`),
].join(' ');

export const reduceLine = ({
  lines,
  previousPoint,
}: {
  lines: Line[];
  previousPoint: Point;
}, point: Point) => {
  const line: Line = { start: point, end: previousPoint };
  return {
    lines: [...lines, line],
    previousPoint: point,
  };
};
export const reduceLines = ([previousPoint, ...points]: Point[]) => {
  const { lines } = points.reduce<{
    lines: Line[];
    previousPoint: Point;
  }>(reduceLine, { lines: [], previousPoint });
  return lines;
};

export const translateLine = ({ start, end }: Line, point: Point): Line => ({
  start: translatePoint(start, point),
  end: translatePoint(end, point),
});
