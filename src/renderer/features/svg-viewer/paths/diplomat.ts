import { GUIDES } from "../config";
import { Line, PathFunction, Point } from "../types";
import { flipPoint, scalePoint } from "../utilities";

// Two angled brackets. The left one is higher. They are not touching. They are interlocking.
export const getPathDiplomat: PathFunction = (scale) => {
  const xOffsetCentre = 0.05;
  const yOuter = GUIDES.outerRadius;
  const yInner = GUIDES.innerRadius;
  const yMiddle = (yOuter + yInner - 0.5) / 2;
  const bottomPointOuter: Point = scalePoint({ x: -xOffsetCentre, y: GUIDES.outerRadius }, scale);
  const bottomPointInner: Point = scalePoint({ x: xOffsetCentre, y: GUIDES.innerRadius - 0.10 }, scale);
  const topPointOuter: Point = flipPoint(bottomPointOuter, 'both');
  const topPointInner: Point = flipPoint(bottomPointInner, 'both');
  const leftPoint: Point = scalePoint({ x: -GUIDES.outerRadius, y: -yMiddle }, scale);
  const rightPoint: Point = flipPoint(leftPoint, 'both');

  const chevronLeftTop: Line = { start: leftPoint, end: topPointOuter };
  const chevronLeftBottom: Line = { start: leftPoint, end: bottomPointInner };
  const chevronRightTop: Line = { start: rightPoint, end: topPointInner };
  const chevronRightBottom: Line = { start: rightPoint, end: bottomPointOuter };

  return [
    chevronLeftTop,
    chevronLeftBottom,
    chevronRightTop,
    chevronRightBottom,
  ].map((line) => `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`).join(' ');
};
