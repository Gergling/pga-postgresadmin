import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { getPathStrategist } from "../../paths";
import { SvgNeonBlood } from "../themes";


export const Strategist: NeonBloodIcon = (props) => {
  const d = getPathStrategist(SIZE_CONFIG[props.size]);
  return <SvgNeonBlood color={'blue'} {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
