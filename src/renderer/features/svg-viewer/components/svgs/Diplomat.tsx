import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { getPathDiplomat } from "../../paths";
import { SvgNeonBlood } from "../themes";


export const Diplomat: NeonBloodIcon = (props) => {
  const d = getPathDiplomat(SIZE_CONFIG[props.size]);
  return <SvgNeonBlood color={'gold'} {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
