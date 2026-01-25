import { Orientation, Point } from "../types";

export const flipPoint = ({ x, y }: Point, orientation: Orientation = 'horizontal'): Point => ({
  x: orientation !== 'vertical' ? -x : x,
  y: orientation !== 'horizontal' ? -y : y,
});
