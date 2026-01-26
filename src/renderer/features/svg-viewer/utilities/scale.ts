import { Box, Point } from "../types";

const defaultSize = 100;

const scale = (value: number, by = defaultSize) => value * by;
export const scaleRadius = (value: number, size = defaultSize) => scale(value, size);

export const scalePoint = (point: Point, to: number): Point => ({
  x: point.x * to,
  y: point.y * to,
});

export const scaleBox = ({ corner, opposite }: Box, to: number): Box => ({
  corner: scalePoint(corner, to),
  opposite: scalePoint(opposite, to),
});
