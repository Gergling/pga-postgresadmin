import { GUIDES } from "../config";
import { Line, PathFunction } from "../types";
import { describeArc, polarToCartesian } from "../utilities";

export const getPathGuardian: PathFunction = (scale) => {
  const radius = GUIDES.outerRadius * scale;
  const totalPoints = 6;
  const segmentArcSize = 360 / totalPoints;
  const points = Array.from({ length: totalPoints }, (_, i) => i).map((i) => polarToCartesian(0, 0, radius, i * segmentArcSize));
  
  // Each one has a line to the next one.
  const lines = points.map((point, i) => {
    const nextPoint = points[(i + 1) % points.length];
    const arc: Line = { start: point, end: nextPoint };
    return arc;
  });
  
  // Central circle.
  const outerArc = describeArc(0, 0, 0.1 * scale, 0, -0.01, { largeArc: true });

  return lines.map((line) => `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`).join(' ') + ' ' + outerArc;
};
