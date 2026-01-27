import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { getPathGuardian } from "../../paths";
import { SvgNeonBlood } from "../themes";


export const Guardian: NeonBloodIcon = (props) => {
  const d = getPathGuardian(SIZE_CONFIG[props.size]);
  return <SvgNeonBlood color={'green'} {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
