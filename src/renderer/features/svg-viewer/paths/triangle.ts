import { GUIDES } from "../config";
import { PointFunction } from "../types";
import { getNormalisedLinePoints, polarToCartesian } from "../utilities";

export const getPathTriangle: PointFunction = (
  { rotation = 0, scale = 1, translation = { x: 0, y: 0 } }
) => getNormalisedLinePoints([0, 120, 240, 0].map(
  (angle) => polarToCartesian(
    translation.x, translation.y, GUIDES.outerRadius * scale, angle + rotation
  )
));
