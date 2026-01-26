import { Line } from "../types";

export const getLinePath = (lines: Line[]): string => lines.map(
  (line) => `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`
).join(' ');
