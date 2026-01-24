import { Line, Point } from "../../types";
import { flipLine } from "../../utilities/line";
import { SvgNeonBlood } from "../themes";

const top: Point = { x: 0, y: -45 };
// const bottom: Point = { x: 0, y: 45 };
const left: Point = { x: -45, y: 0 };
// const right: Point = { x: 45, y: 0 };

const topLeft: Line = { start: top, end: left };
const topRight: Line = flipLine(topLeft);
const bottomLeft: Line = flipLine(topLeft, false);
const bottomRight: Line = flipLine(topRight, false);

const d = [
  topLeft, topRight, bottomLeft, bottomRight,
].map((line) => `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`).join(' ');

export const Librarian = () => {
  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
