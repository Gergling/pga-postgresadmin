import { getPathMagicCircle } from "../../paths/magic-circle";
import { SvgNeonBlood } from "../themes";
import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { useMemo } from "react";


export const Placeholder: NeonBloodIcon = (props) => {
  const {
    d,
    fontSize,
  } = useMemo(() => {
    const scale = SIZE_CONFIG[props.size];
    const d = getPathMagicCircle(scale);
    const fontSize = 20 * scale / 100;
    return { d, fontSize };
  }, [props.size]);
  return <SvgNeonBlood {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
    <text x="0" y="0" textAnchor="middle" fontSize={fontSize} fill="none" baselineShift={'-40%'}>?</text>
  </SvgNeonBlood>;
};
