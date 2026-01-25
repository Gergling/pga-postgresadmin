import { getPathMagicCircle } from "../../paths/magic-circle";
import { SvgNeonBlood } from "../themes";

const d = getPathMagicCircle(100);

export const Placeholder = () => {
  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
    <text x="0" y="0" textAnchor="middle" fontSize="20" fill="none" baselineShift={'-40%'}>?</text>
  </SvgNeonBlood>;
};
