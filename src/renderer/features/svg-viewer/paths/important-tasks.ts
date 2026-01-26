import { GUIDES } from "../config";
import { PathFunction } from "../types";
import { flipPoint, mapLine, scalePoint, translateLine } from "../utilities";
import { getLinePath } from "./line";
import { getPathRectangle } from "./rectangle";

const x = 0.1;

export const getPathImportantTasksBody: PathFunction = (scale) => {
  const corner = scalePoint({ x, y: GUIDES.outerRadius }, scale);
  const opposite = flipPoint({ x: corner.x, y: -GUIDES.innerRadius * scale / 2 });
  const lowerGeometry = getPathRectangle({ corner, opposite });

  return [lowerGeometry].join(' ');
};

export const getPathImportantTasksCrown: PathFunction = (scale) => {
  // Create all the crown points.
  const translation = { x: 0, y: -GUIDES.innerRadius * scale };
  const topLeft = scalePoint({ x, y: x }, scale);
  const bottomLeft = flipPoint(topLeft, 'vertical');
  const bottomRight = flipPoint(bottomLeft, 'horizontal');
  const topRight = flipPoint(bottomRight, 'vertical');
  const rightTrough = { x: topRight.x / 2, y: 0 };
  const top = scalePoint({ x: 0, y: x }, scale);
  const leftTrough = flipPoint(rightTrough, 'horizontal');

  // Flip the crown over and create lines between the points.
  const lines = [
    topLeft, bottomLeft, bottomRight, topRight, rightTrough, top, leftTrough
  ].map((point) => flipPoint(point, 'vertical')).map(mapLine);

  // Translate to the correct location.
  const translatedLines = lines.map((line) => translateLine(line, translation));

  // Draw the path.
  const lowerGeometry = getLinePath(translatedLines);

  return [lowerGeometry].join(' ');
};
