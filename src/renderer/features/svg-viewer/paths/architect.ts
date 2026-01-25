import { GUIDES } from "../config";
import { Line, PathFunction, Point } from "../types";
import { polarToCartesian } from "../utilities";

export const getPathArchitect: PathFunction = (scale) => {
  const radius = GUIDES.outerRadius * scale;
  const totalPoints = 6;
  const segmentArcSize = 360 / totalPoints;
  const points = Array.from({ length: totalPoints }, (_, i) => i).map((i) => polarToCartesian(0, 0, radius, i * segmentArcSize));
  const centre: Point = { x: 0, y: 0 };

  // Each one has a line to the next one, AND the centre.
  const lines = points.reduce((acc, point, i) => {
    const nextPoint = points[(i + 1) % points.length];
    const arc: Line = { start: point, end: nextPoint };
    if (i % 2 === 0) return [...acc, arc];
    return [...acc, arc, { start: point, end: centre }];
  }, []);

  return lines.map((line) => `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`).join(' ');
};
