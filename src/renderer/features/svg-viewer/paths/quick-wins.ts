import { PathFunction, Point } from "../types";
import { mapLine, polarToCartesian, scaleLine, translatePoint } from "../utilities";
import { mapLinePath } from "./line";

const westAngle = 15;
const arcAngle = 20;
const eastAngle = westAngle + arcAngle;
const layerHeightWest = 0.25;
const layerHeightEast = layerHeightWest * 1.3;
const layerShift = -0.1;
const layerGap = 0.05;
const layerShiftTranslation: Point = { x: layerShift, y: -layerGap };
const strikePoint: Point = { x: -0.1, y: 0.45 };

const bottom = [
  polarToCartesian(strikePoint.x, strikePoint.y, layerHeightWest, westAngle),
  strikePoint,
  polarToCartesian(strikePoint.x, strikePoint.y, layerHeightEast, eastAngle),
];

const middleWest = translatePoint(bottom[0], layerShiftTranslation);
const middleEast = translatePoint(bottom[2], layerShiftTranslation);

const middle = [
  polarToCartesian(middleWest.x, middleWest.y, layerHeightWest, westAngle),
  middleWest,
  middleEast,
  polarToCartesian(middleEast.x, middleEast.y, layerHeightEast, eastAngle),
];

const topWest = translatePoint(middle[0], layerShiftTranslation);
const topEast = translatePoint(middle[3], layerShiftTranslation);

const top = [
  polarToCartesian(topWest.x, topWest.y, layerHeightWest, westAngle),
  topWest,
  topEast,
  polarToCartesian(topEast.x, topEast.y, layerHeightEast, eastAngle),
];

const lines = [top, middle, bottom].map((layer) => layer.map(mapLine)).flat();

export const getPathQuickWins: PathFunction = (scale) => {
  return lines.map(scaleLine(scale)).map(mapLinePath).join(' ');
};
