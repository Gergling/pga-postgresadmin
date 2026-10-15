import { PointFunction } from "../types";
import { getNormalisedLinePoints, polarToCartesian } from "../utilities";

// Two angled brackets. The left one is higher. They are not touching. They are interlocking.
export const getPathBracketChevron: PointFunction = ({
  rotation = 0, scale = 1, translation = { x: 0, y: 0 }
}) => getNormalisedLinePoints([0, 90, 180].map((angle) => polarToCartesian(
  translation.x, translation.y, scale / 2, angle + rotation
)));
