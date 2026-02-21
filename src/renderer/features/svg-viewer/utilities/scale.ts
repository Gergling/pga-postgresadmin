import { Box, Point } from "../types";

type ScaleFunction<T> = (value: T) => T;
export const scale = (to: number) => {
  const rescale = (value: number) => scale(value * to);
  const point: ScaleFunction<Point> = (value) => ({
    x: value.x * to,
    y: value.y * to,
  });
  const box: ScaleFunction<Box> = ({ corner, opposite }) => ({
    corner: point(corner),
    opposite: point(opposite),
  });
  return {
    box,
    point,
    rescale,
  };
};

export const scalePoint = (point: Point, to: number): Point => scale(to).point(point);

export const scaleBox = ({ corner, opposite }: Box, to: number): Box => ({
  corner: scalePoint(corner, to),
  opposite: scalePoint(opposite, to),
});

export const getLimitsFactory = (scale: number) => {
  const max = scale / 2;
  const min = -max;
  return (value: number) => {
    const exceeds = value >= max ? 1 : value <= min ? -1 : 0;
    const limited = Math.min(Math.max(value, min), max);
    return { exceeds, limited, max, min };
  };
};
