import { Line, Orientation, Point } from "../types";
import { flipPoint } from "./point";

export const flipLine = (line: Line, orientation: Orientation = 'horizontal'): Line => ({
  start: flipPoint(line.start, orientation),
  end: flipPoint(line.end, orientation),
});

export const getLineScalePoint = ({ start, end }: Line, scale: number): Point => ({
  x: ((end.x - start.x) * scale) + start.x,
  y: ((end.y - start.y) * scale) + start.y,
});
