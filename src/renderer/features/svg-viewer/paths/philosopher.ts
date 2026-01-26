import { GUIDES } from "../config";
import { PathFunction } from "../types";
import { describeArc, mapLine, polarToCartesian } from "../utilities";
import { getLinePath } from "./line";

export const getPathPhilosopher: PathFunction = (scale) => {
  const yTranslation = 0.1125 * scale;
  const circle = describeArc(0, yTranslation, 0.15 * scale, 0, -0.01, { largeArc: true });

  const lines = [0, 120, 240]
    .map((angle) => polarToCartesian(0, yTranslation, GUIDES.outerRadius * scale, angle))
    .map(mapLine);

  const triangle = getLinePath(lines);

  return [circle, triangle].join(' ');
};
