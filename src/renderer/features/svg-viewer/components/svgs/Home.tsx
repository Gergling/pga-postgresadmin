import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { getPathHome } from "../../paths";
import { SvgNeonBlood } from "../themes";


export const Home: NeonBloodIcon = (props) => {
  const d = getPathHome(SIZE_CONFIG[props.size]);
  return <SvgNeonBlood {...props}>
    <path
      d={d}
      fill="none" 
    />
  </SvgNeonBlood>
};
