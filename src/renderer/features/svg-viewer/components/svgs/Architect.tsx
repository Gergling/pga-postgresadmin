import { getPathArchitect } from "../../paths";
import { SvgNeonBlood } from "../themes";

const d = getPathArchitect(100);

export const Architect = () => {
  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
