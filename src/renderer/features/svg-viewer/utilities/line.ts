import { Line } from "../types";
import { flipPoint } from "./point";

export const flipLine = (line: Line, horizontal = true) => ({
  start: flipPoint(line.start, horizontal),
  end: flipPoint(line.end, horizontal),
});
