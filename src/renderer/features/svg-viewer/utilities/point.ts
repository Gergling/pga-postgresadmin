import { Point } from "../types";

export const flipPoint = ({ x, y }: Point, horizontal = true): Point => ({
  x: horizontal ? -x : x,
  y: horizontal ? y : -y,
});
