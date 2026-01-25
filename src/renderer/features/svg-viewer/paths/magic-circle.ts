import { GUIDES } from "../config";
import { PathFunction } from "../types";
import { describeArc } from "../utilities";

export const getPathMagicCircle: PathFunction = (scale) => {
  const outer = describeArc(0, 0, GUIDES.outerRadius * scale, 0, -0.01, { largeArc: true });
  const inner = describeArc(0, 0, GUIDES.innerRadius * scale, 0, -0.01, { largeArc: true });

  return [outer, inner].join(' ');
};
