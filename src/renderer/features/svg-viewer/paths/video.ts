import { PathFunction } from "../types";
import { getPath } from "../utilities";
import { getPathBracketArc } from "./bracket-arc";
import { getPathOutline } from "./outline";
import { getPathOutlineDiagonalSquare } from "./outline-diagonal-square";
import { getPathTriangle } from "./triangle";

// Process outline containing a transitional triangle.
// Needs the iris to represent visual art but ideally should include the "waves"
// of audio as well.

const scaleUp = 1 / Math.E;
const scaleDown = 1 - scaleUp;
const getScaleUp = (
  { layers = 1, scale = 1 }: { layers?: number; scale?: number }
) => Math.pow(scaleUp, layers) * scale;
const getScaleDown = (
  { layers = 1, scale = 1 }: { layers?: number; scale?: number }
) => Math.pow(scaleDown, layers) * scale;

export const getPathVideo: PathFunction = (scale) => {
  // Layer 1
  const outline = getPathOutline({ points: 6, scale });

  // Layer 2
  const artChevronBrackets = getPathOutlineDiagonalSquare({
    offset: getScaleUp({ layers: 2 }),
    scale: getScaleDown({ layers: 1.3, scale }),
  });

  // Layer 3
  const triangle = getPathTriangle({
    rotation: 90, scale: getScaleDown({ layers: 2, scale })
  });

  // Layer 4
  const eyePath = getPathBracketArc(getScaleDown({ layers: 3, scale }));

  return getPath([
    ...artChevronBrackets, ...outline, ...triangle
  ]) + ' ' + eyePath;
};
