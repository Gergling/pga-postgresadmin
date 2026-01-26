import { GUIDES } from "../config";
import { PathFunction } from "../types";
import { describeArc } from "../utilities";

export const getPathHome: PathFunction = (scale) => {
  const outer = describeArc(0, 0, GUIDES.outerRadius * scale, 0, -0.01, { largeArc: true });
  const innerRight = describeArc(0, 0, GUIDES.innerRadius * scale, 30, 150);
  const innerLeft = describeArc(0, 0, GUIDES.innerRadius * scale, 210, 330);
  const scaled = scale * 2;
  const xRight = (0.02 - GUIDES.outerRadius) * scaled;
  const eyeArcLengthHalf = 36 / 2;
  const startRight = 90 - eyeArcLengthHalf;
  const endRight = 90 + eyeArcLengthHalf;
  const xLeft = -xRight;
  const startLeft = 270 - eyeArcLengthHalf;
  const endLeft = 270 + eyeArcLengthHalf;
  const eyeRight = describeArc(xRight, 0, GUIDES.outerRadius * scaled, startRight, endRight);
  const eyeLeft = describeArc(xLeft, 0, GUIDES.outerRadius * scaled, startLeft, endLeft);

  return [outer, innerLeft, innerRight, eyeRight, eyeLeft].join(' ');
};
