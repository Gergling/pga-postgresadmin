import { BaseResponse, Point } from "../types";

const getLinePath = (
  [move, ...points]: Point[]
): string => [
  `M ${move.x} ${move.y}`,
  ...points.map(
    ({ x, y }, idx) => {
      // If the end is identical to the beginning, we may as well use Z.
      if (
        idx >= points.length - 1 && x === move.x && y === move.y
      ) return `Z`;

      // If the end is the same as the previous line, we can skip it.
      if (
        idx > 0 && x === points[idx - 1].x && y === points[idx - 1].y
      ) return '';

      // Otherwise, just draw a line.
      return `L ${x} ${y}`;
    }
  )
].join(' ');
export const getPath = (
  shapes: BaseResponse[]
): string => shapes.map((shape) => {
  switch (shape.type) {
    case 'lines': return getLinePath(shape.points);
  }
}).join(' ');

export const getNormalisedLinePoints = (
  params: Point[]
): BaseResponse[] => params.length ? [{ points: params, type: 'lines' }] : [];
