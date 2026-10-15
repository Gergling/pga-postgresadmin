import { PointFunction } from "../types";
import { getPathBracketChevron } from "./bracket-chevron";

// This is the diagonal square for performance goals. It should be made of two
// angled brackets.

export const getPathOutlineDiagonalSquare: PointFunction<{
  offset?: number;
}> = ({ offset = 0, ...params }) => {
  const scale = params.scale ?? 1;
  const translation = {
    x: 0, y: 0,
    ...(params.translation || {}),
  };
  const left = getPathBracketChevron({
    ...params, translation: {
      ...translation, x: translation.x + (offset * scale)
    }
  });
  const right = getPathBracketChevron({
    ...params, rotation: 180, translation: {
      ...translation, x: translation.x - (offset * scale)
    }
  });
  return [...left, ...right];
};
