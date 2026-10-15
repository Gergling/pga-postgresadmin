import { GUIDES } from "../config";
import { PointFunction } from "../types";
import { getNormalisedLinePoints, polarToCartesian } from "../utilities";

export const getPathOutline: PointFunction<{ points: number }> = (
  { points, rotation = 0, scale = 1, translation = { x: 0, y: 0 } }
) => getNormalisedLinePoints(Array.from(
  { length: points + 1 },
  (_, i) => {
    const angle = (360 * i) / points;
    return polarToCartesian(
      translation.x, translation.y, GUIDES.outerRadius * scale,
      angle + rotation
    )
  }
));
