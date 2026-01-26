import { getPathHome } from "../../paths";
import { SvgNeonBlood } from "../themes";

const d = getPathHome(100);

export const Home = () => {
  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
    />
  </SvgNeonBlood>
};
