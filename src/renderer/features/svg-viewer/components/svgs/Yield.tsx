import { useMemo } from "react";
import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { SvgNeonBlood } from "../themes";
import { getPathYield } from "../../paths/yield";

export const Yield: NeonBloodIcon = (props) => {
  const d = useMemo(() => {
    const scale = SIZE_CONFIG[props.size];
    return getPathYield(scale);
  }, [props.size]);
  return <SvgNeonBlood color={'blood'} {...props}>
    <path
      d={d}
      fill="none" 
      // strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
