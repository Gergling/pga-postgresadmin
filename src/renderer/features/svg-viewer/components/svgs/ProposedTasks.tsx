import { GUIDES } from "../../config";
import { describeArc, scaleRadius } from "../../utilities";
import { SvgNeonBlood } from "../themes";

export const ProposedTasks = () => {
  const glitchStart = 0;
  const glitchMiddle = 60;
  const glitchEnd = 120;
  const outerMainPath = describeArc(0, 0, scaleRadius(GUIDES.outerRadius), glitchEnd, glitchStart, { largeArc: true });
  const innerMainPath = describeArc(0, 0, scaleRadius(GUIDES.innerRadius), glitchEnd, glitchStart, { largeArc: true });
  const glitchRadius = (GUIDES.innerRadius + GUIDES.outerRadius) / 2;
  const glitchInnerPath = describeArc(5, -5, scaleRadius(GUIDES.innerRadius), glitchStart, glitchMiddle);
  const glitchOuterPath = describeArc(5, 0, scaleRadius(glitchRadius), glitchMiddle, glitchEnd);
  const d = [outerMainPath, innerMainPath, glitchInnerPath, glitchOuterPath].join(' ');

  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
    />
  </SvgNeonBlood>
};
