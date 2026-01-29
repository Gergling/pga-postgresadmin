import { NeonBloodIcon } from "../../config/neon";
import { SvgNeonBlood } from "../themes";

// Quick Wins Path Logic
const d = [
  "M30 70 L50 30 L70 50", // The main feathered "head"
  "M35 75 L45 55",       // Lower feather 1
  "M40 80 L50 60"        // Lower feather 2
].join(' ');

export const QuickWins: NeonBloodIcon = (props) => {
  return <SvgNeonBlood {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
      transform="translate(-50, -50)"
    />
  </SvgNeonBlood>;
};
