import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { getPathPhilosopher } from "../../paths";
import { SvgNeonBlood } from "../themes";


export const Philosopher: NeonBloodIcon = (props) => {
  const d = getPathPhilosopher(SIZE_CONFIG[props.size]);
  return <SvgNeonBlood {...props}>
    <path
      d={d}
      fill="none" 
    />
  </SvgNeonBlood>
};
