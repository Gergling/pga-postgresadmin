import { NeonBloodIcon, SIZE_CONFIG } from "../../config/neon";
import { getPathVideo } from "../../paths";
import { SvgNeonBlood } from "../themes";

export const Video: NeonBloodIcon = (props) => {
  const d = getPathVideo(SIZE_CONFIG[props.size]);
  return <SvgNeonBlood color={'blood'} {...props}>
    <path
      d={d}
      fill="none"
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
