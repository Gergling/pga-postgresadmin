import { Box, Line } from "../types";
import { flipBox } from "../utilities/box";

export const getPathRectangle = (box: Box): string => {
  const flipped = flipBox(box);

  // Each one has a line to the next one.
  const lines = [box.corner, flipped.corner, box.opposite, flipped.opposite].map((point, i, points) => {
    const nextPoint = points[(i + 1) % points.length];
    const arc: Line = { start: point, end: nextPoint };
    return arc;
  });

  return lines.map((line) => `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`).join(' ');
};
