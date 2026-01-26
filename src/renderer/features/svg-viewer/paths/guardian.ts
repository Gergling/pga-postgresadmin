import { GUIDES } from "../config";
import { Line, PathFunction } from "../types";
import { describeArc, polarToCartesian } from "../utilities";
import { getLinePath } from "./line";

const hexagon = (
  totalPoints: number,
  radius: number,
  segmentArcSize: number
): string => {
  const points = Array
    .from({ length: totalPoints }, (_, i) => i)
    .map((i) => polarToCartesian(0, 0, radius, i * segmentArcSize));
  
  // Each one has a line to the next one.
  const lines = points.map((point, i) => {
    const nextPoint = points[(i + 1) % points.length];
    const arc: Line = { start: point, end: nextPoint };
    return arc;
  });

  return getLinePath(lines);
};

export const getPathGuardian: PathFunction = (scale) => {
  const totalPoints = 6;
  const segmentArcSize = 360 / totalPoints;
  
  const outer = hexagon(totalPoints, GUIDES.outerRadius * scale, segmentArcSize);
  const inner = hexagon(totalPoints, GUIDES.innerRadius * scale, segmentArcSize);
  
  // Central core.
  const core = describeArc(0, 0, 0.05 * scale, 0, -0.01, { largeArc: true });

  return [outer, inner, core].join(' ');
};
