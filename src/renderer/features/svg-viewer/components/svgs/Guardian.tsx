import { getPathGuardian } from "../../paths";
import { SvgNeonBlood } from "../themes";

const d = getPathGuardian(100);

export const Guardian = () => {
  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
