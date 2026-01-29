import { Box, Line, PathFunction, Point } from "../types";
import { flipLine, flipPoint, getLineScalePoint, isPointZero, limitLine, limitPointFactory, mapLine, polarToCartesian, preProcessPointsReducerFactory, reduceLine, reduceLines, scaleBox, scaleLine } from "../utilities";
import { getLinePath } from "./line";

// Angles:
// * parallel (6)
// * perpendicular (6)
// * horizontal (2)
// * vertical (1)
// * shallow (3)
// * steep (3)

const arrowAngle = 50; // Degrees
const arrowHeadEdgeLength = 0.3; // A radius
const arrowHeadConnectorLength = arrowHeadEdgeLength * 0.7; // Another radius
const connectorAngle = arrowAngle * 0.5; // Degrees
const halfArrowAngle = arrowAngle / 2;
const halfConnectorAngle = connectorAngle / 2;

const getArrowGeometryFactory = (
  directionAngleDegrees: number
) => (
  tip: Point,
): Point[] => {
  const { x, y } = tip;
  const directionAngle = 180 + directionAngleDegrees;
  const connectors = [
    polarToCartesian(x, y, arrowHeadConnectorLength, directionAngle -halfConnectorAngle),
    polarToCartesian(x, y, arrowHeadConnectorLength, directionAngle +halfConnectorAngle),
  ];
  const arrowHead = [
    connectors[0],
    polarToCartesian(x, y, arrowHeadEdgeLength, directionAngle -halfArrowAngle),
    tip,
    polarToCartesian(x, y, arrowHeadEdgeLength, directionAngle +halfArrowAngle),
    connectors[1],
  ];
  const shaftLength = 0.95;
  // const shaftLength = 0.1 looks pretty cool with an extra polarToCartesian(x, y, shaftLength, directionAngle) added to the arrowhead, FYI
  const shaft = [
    polarToCartesian(connectors[1].x, connectors[1].y, shaftLength, directionAngle),
    // polarToCartesian(x, y, shaftLength, directionAngle),
    polarToCartesian(connectors[0].x, connectors[0].y, shaftLength, directionAngle),
  ];

  return [
    ...arrowHead,
    ...shaft,
  ];
};

const mapDebug = (msg: string) => (stuff: any) => {
  console.log(msg, stuff);
  return stuff;
};

export const getPathStrategist: PathFunction = (scale) => {
  const getArrowGeometry = getArrowGeometryFactory(60);
  return [
    // { x: 0, y: -0.3 },
    getArrowGeometryFactory(60)({ x: 0.43, y: -0.35 }),
    getArrowGeometryFactory(30)({ x: 0.4, y: 0 }),
  ]
    // .map(getArrowGeometry) // Points
    .map(arrow => mapDebug('=== Arrow!')(arrow)
      .reduce(preProcessPointsReducerFactory(({ acc, current, previous, isFirst }): Point[] => {
        if (isFirst) return [current];
        const limitScale = 0.95;
        // IF the current point will take us off-screen, we need to put it at the
        // edge of the screen based on the vector.
        const { limitPoint } = limitPointFactory(limitScale);
        const previousLimit = limitPoint(previous);
        const currentLimit = limitPoint(current);

        // If the vector does not exceed the limits, we continue.
        if (isPointZero(previousLimit.exceeds) && isPointZero(currentLimit.exceeds)) {
          return [...acc, current];
        }

        const delta: Point = {
          x: current.x - previous.x,
          y: current.y - previous.y,
        };

        // If the delta is 0, we have simply copied the previous point into the
        // current one, and have no gradient to calculate the intersection, so we
        // can skip the current point.
        if (isPointZero(delta)) {
          return acc;
        }

        // We have an infinite gradient, so since both x values are equal, we
        // may as well set them again. This will copy the next point, which
        // will be omitted as a copy.
        if (delta.x === 0) {
          return [
            ...acc,
            { x: current.x, y: currentLimit.limited.y },
          ];
        }

        // We have a 0 gradient or flat surface.
        if (delta.y === 0) {
          return [
            ...acc,
            { x: currentLimit.limited.x, y: current.y },
          ];
        }

        const gradient = delta.y / delta.x;
        const yIntercept = previous.y - gradient * previous.x;

        const clipPoint = (p: Point): Point => {
          const pLimits = limitPoint(p);
          if (isPointZero(pLimits.exceeds)) {
            return p;
          }

          const newP = { ...p };

          // If x is out of bounds, clamp x and calculate y.
          if (pLimits.exceeds.x !== 0) {
            newP.x = pLimits.limited.x;
            newP.y = gradient * newP.x + yIntercept;
          }

          // Now, the new y might ALSO be out of bounds. Check it.
          const newPLimits = limitPoint(newP);
          if (newPLimits.exceeds.y !== 0) {
            newP.y = newPLimits.limited.y;
            // If we clamp y, we must recalculate x to stay on the line.
            if (gradient !== 0) {
              newP.x = (newP.y - yIntercept) / gradient;
            }
          }
          return newP;
        };

        const clipped = clipPoint(current);

        console.log('clipped', clipped, current)

        // Check if both are out of bounds...
        // if (!isPointZero(previousLimit.exceeds) && !isPointZero(currentLimit.exceeds)) {
        //   // Find the nearest edge point.
        //   if (previousLimit.exceeds.x !== 0) {}
        // }

        return [...acc, clipped];
      }), [])
      .map(mapLine) // Lines
      // .map(mapDebug('line'))
      // .map(limitLine(0.95)) // Limited to boundaries
      // TODO: Instead of limiting the individual lines, I need to run a
      // callback that analyses when a line goes over the limits and exactly
      // where it does so. That way I can return a set of offscreen points
      // where the line goes over the limits and add them to another array to
      // be made into lines.
      // .map((line: Line) => {
      //   const { start, end } = line;
      //   const { limitPoint } = limitPointFactory(scale);
      //   const startLimit = limitPoint(start);
      //   const endLimit = limitPoint(end);
      //   if (isPointZero(startLimit.exceeds) && isPointZero(endLimit.exceeds)) {
      //     return { start, end };
      //   }
      //   console.log

      //   return line;
      // })
      .map(scaleLine(scale)) // Scaled
      // .map((line: Line, i: number, all: Line[]) => {
      //   if (i === 0 || i === all.length - 1) {
      //     console.log('+++ First and last lines', scale, i, line.start, line.end)
      //   }
      //   return line;
      // })
    )
    .map(getLinePath).join(' ')
    // + getLinePath([
    //   { start: { x: 0, y: 0 }, end: { x: 0.3, y: 0 } },
    //   { start: { x: 0.3, y: 0.3 }, end: { x: 0.3, y: 0 } },
    //   { start: { x: 0.3, y: 0.3 }, end: { x: 0, y: 0 } }
    // ].map(scaleLine(scale)));
};
