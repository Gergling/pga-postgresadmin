import { getPathDiplomat } from "../../paths";
import { SvgNeonBlood } from "../themes";

const d = getPathDiplomat(100);

export const Diplomat = () => {
  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
