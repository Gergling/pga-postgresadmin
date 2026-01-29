import { Orientation, Point } from "../types";
import { getLimitsFactory } from "./scale";

export const flipPoint = ({ x, y }: Point, orientation: Orientation = 'horizontal'): Point => ({
  x: orientation !== 'vertical' ? -x : x,
  y: orientation !== 'horizontal' ? -y : y,
});

export const translatePoint = ({ x, y }: Point, by: Point): Point => ({
  x: x + by.x,
  y: y + by.y,
});

// export const limitPoint = (scale: number) => {
//   const max = scale / 2;
//   const min = -max;
//   return ({ x, y }: Point): Point => ({
//     x: Math.min(Math.max(x, min), max),
//     y: Math.min(Math.max(y, min), max),
//   });
// };

export const isPointZero = ({ x, y }: Point) => x === 0 && y === 0;

export const limitPointFactory = (scale: number) => {
  const getLimits = getLimitsFactory(scale);
  return {
    getLimits,
    limitPoint: ({ x, y }: Point) => {
      const limits = {
        x: getLimits(x),
        y: getLimits(y),
      };
      return {
        exceeds: {
          x: limits.x.exceeds,
          y: limits.y.exceeds,
        },
        limited: {
          x: limits.x.limited,
          y: limits.y.limited,
        },
        max: {
          x: limits.x.max,
          y: limits.y.max,
        },
        min: {
          x: limits.x.min,
          y: limits.y.min,
        },
      };
    },
  };
};
