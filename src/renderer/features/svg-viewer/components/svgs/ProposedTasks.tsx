import { GUIDES } from "../../config";
import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { getPathLibrarian } from "../../paths";
import { describeArc } from "../../utilities";
import { SvgNeonBlood } from "../themes";


export const ProposedTasks: NeonBloodIcon = (props) => {
  const scale = SIZE_CONFIG[props.size];
  const librarian = getPathLibrarian(38 * scale / 100);
  const glitchStart = 0;
  const glitchMiddle = 60;
  const glitchEnd = 120;
  const outerMainPath = describeArc(0, 0, GUIDES.outerRadius * scale, glitchEnd, glitchStart, { largeArc: true });
  const innerMainPath = describeArc(0, 0, GUIDES.innerRadius * scale, glitchEnd, glitchStart, { largeArc: true });
  const glitchRadius = (GUIDES.innerRadius + GUIDES.outerRadius) / 2;
  const glitchInnerPath = describeArc(5, -5, GUIDES.innerRadius * scale, glitchStart, glitchMiddle);
  const glitchOuterPath = describeArc(5, 0, glitchRadius * scale, glitchMiddle, glitchEnd);
  const d = [outerMainPath, innerMainPath, glitchInnerPath, glitchOuterPath].join(' ');

  return <SvgNeonBlood {...props}>
    <path
      d={d}
      fill="none" 
    />
    <path d={librarian} fill="none" />
  </SvgNeonBlood>
};
