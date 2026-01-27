import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { getPathLibrarian } from "../../paths";
import { SvgNeonBlood } from "../themes";


export const Librarian: NeonBloodIcon = (props) => {
  const d = getPathLibrarian(SIZE_CONFIG[props.size]);
  return <SvgNeonBlood color={'slate'} {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
