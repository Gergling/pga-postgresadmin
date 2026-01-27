import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { getPathArchitect } from "../../paths";
import { SvgNeonBlood } from "../themes";


export const Architect: NeonBloodIcon = (props) => {
  const d = getPathArchitect(SIZE_CONFIG[props.size]);
  return <SvgNeonBlood color={'orange'} {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
