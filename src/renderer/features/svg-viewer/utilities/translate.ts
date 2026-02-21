import { Point } from "../types";

type TranslateFunction<T> = (value: T) => T;
export const translate = (by: Point) => {
  const point: TranslateFunction<Point> = ({ x, y }) => ({
    x: x + by.x,
    y: y + by.y,
  });
  return {
    point,
  };
};
