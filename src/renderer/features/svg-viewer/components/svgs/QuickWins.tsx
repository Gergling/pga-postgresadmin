import { useMemo } from "react";
import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { SvgNeonBlood } from "../themes";
import { getPathQuickWins } from "../../paths/quick-wins";

export const QuickWins: NeonBloodIcon = (props) => {
  const d = useMemo(() => {
    const scale = SIZE_CONFIG[props.size];
    return getPathQuickWins(scale);
  }, [props.size]);
  return <SvgNeonBlood color={'blue'} {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
