import { getPathPhilosopher } from "../../paths";
import { SvgNeonBlood } from "../themes";

const d = getPathPhilosopher(100);

export const Philosopher = () => {
  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
    />
  </SvgNeonBlood>
};
