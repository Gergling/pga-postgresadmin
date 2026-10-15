import { GUIDES } from "../config";
import { PathFunction } from "../types";
import { describeArc } from "../utilities";

// A single left-opening arc, as used for the "eye".

export const getPathBracketArc: PathFunction = (scale) => {
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

  return [eyeRight, eyeLeft].join(' ');
};
