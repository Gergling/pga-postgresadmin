import { Box, Line, PathFunction, Point } from "../types";
import { flipLine, flipPoint, getLineScalePoint, scaleBox } from "../utilities";

export const getPathLibrarian: PathFunction = (scale) => {
  const top: Point = { x: 0, y: -0.45 * scale };
  const left: Point = { x: -0.45 * scale, y: 0 };
  
  const topLeft: Line = { start: top, end: left };
  const topRight: Line = flipLine(topLeft);
  const bottomLeft: Line = flipLine(topLeft, 'vertical');
  const bottomRight: Line = flipLine(topRight, 'vertical');
  
  const innerBox: Box = scaleBox({
    corner: getLineScalePoint(topLeft, 0.5),
    opposite: getLineScalePoint(bottomRight, 0.5),
  }, 0.8);
  
  const topLine: Line = {
    start: { x: innerBox.corner.x + (0.05 * scale), y: innerBox.corner.y },
    end: flipPoint({ x: innerBox.corner.x + (0.05 * scale), y: innerBox.corner.y })
  };
  const middleLine: Line = {
    start: { x: innerBox.corner.x + (0.1 * scale), y: 0 },
    end: flipPoint({ x: innerBox.corner.x - (0.1 * scale), y: 0 })
  };
  const bottomLine: Line = {
    start: { x: -innerBox.opposite.x, y: innerBox.opposite.y },
    end: { x: innerBox.opposite.x - (0.15 * scale), y: innerBox.opposite.y }
  };
  
  return [
    topLeft, topRight, bottomLeft, bottomRight, 
    topLine, middleLine, bottomLine,
  ].map((line) => `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`).join(' ');
};
