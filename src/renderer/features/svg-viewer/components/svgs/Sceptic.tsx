import { Line } from "../../types";
import { flipLine } from "../../utilities/line";
import { SvgNeonBlood } from "../themes";

const xCenter = 2;
const xTip = xCenter + 25;
const yTop = -45;
const yBottom = 45;

const right: Line[] = [
  { start: { x: xCenter, y: yTop }, end: { x: xTip, y: yTop } },
  { start: { x: xCenter, y: yBottom }, end: { x: xTip, y: yTop } },
  { start: { x: xCenter, y: yBottom }, end: { x: xCenter, y: yTop } },
];
const left: Line[] = right.map((line) => flipLine(line, 'horizontal'));

export const Sceptic = () => {
  const d = [
    ...right,
    ...left,
  ].map((line) => `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`).join(' ');

  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
