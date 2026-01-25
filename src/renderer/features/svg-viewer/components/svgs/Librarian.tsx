import { getPathLibrarian } from "../../paths";
import { SvgNeonBlood } from "../themes";

const d = getPathLibrarian(100);

export const Librarian = () => {
  return <SvgNeonBlood>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};
