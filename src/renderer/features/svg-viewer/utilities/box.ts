import { Box, Orientation, Point } from "../types";
import { flipPoint, translatePoint } from "./point";

export const flipBox = (
  { corner, opposite }: Box,
  orientation: Orientation = 'horizontal'
): Box => ({
  corner: flipPoint(corner, orientation),
  opposite: flipPoint(opposite, orientation),
});

export const translateBox = (box: Box, by: Point): Box => ({
  corner: translatePoint(box.corner, by),
  opposite: translatePoint(box.opposite, by),
});
