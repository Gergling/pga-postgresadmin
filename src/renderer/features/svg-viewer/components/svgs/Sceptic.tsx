import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { Line } from "../../types";
import { flipLine, scaleLine } from "../../utilities/line";
import { SvgNeonBlood } from "../themes";


export const Sceptic: NeonBloodIcon = (props) => {
  const scale = SIZE_CONFIG[props.size]
  const xCenter = 0.02;
  const xTip = xCenter + 0.25;
  const yTop = -0.45;
  const yBottom = 0.45;
  
  const right: Line[] = [
    { start: { x: xCenter, y: yTop }, end: { x: xTip, y: yTop } },
    { start: { x: xCenter, y: yBottom }, end: { x: xTip, y: yTop } },
    { start: { x: xCenter, y: yBottom }, end: { x: xCenter, y: yTop } },
  ];
  const left: Line[] = right.map((line) => flipLine(line, 'horizontal'));
  const d = [
    ...right,
    ...left,
  ].map(scaleLine(scale)).map((line) => `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`).join(' ');

  return <SvgNeonBlood color={'purple'} {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
