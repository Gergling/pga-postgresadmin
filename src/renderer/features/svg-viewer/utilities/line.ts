import { Line, Orientation, Point } from "../types";
import { flipPoint, translatePoint } from "./point";
import { scalePoint } from "./scale";

export const flipLine = (line: Line, orientation: Orientation = 'horizontal'): Line => ({
  start: flipPoint(line.start, orientation),
  end: flipPoint(line.end, orientation),
});

export const getLineScalePoint = ({ start, end }: Line, scale: number): Point => ({
  x: ((end.x - start.x) * scale) + start.x,
  y: ((end.y - start.y) * scale) + start.y,
});

export const scaleLine = ({ start, end }: Line, scale: number): Line => ({
  start: scalePoint(start, scale),
  end: scalePoint(end, scale),
});

export const mapLine = (point: Point, i: number, points: Point[]) => {
  const nextPoint = points[(i + 1) % points.length];
  const arc: Line = { start: point, end: nextPoint };
  return arc;
};

export const translateLine = ({ start, end }: Line, point: Point): Line => ({
  start: translatePoint(start, point),
  end: translatePoint(end, point),
});
