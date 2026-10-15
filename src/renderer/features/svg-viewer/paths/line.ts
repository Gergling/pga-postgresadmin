import { Line } from "../types";

/**
 * @deprecated Use points and draw them into a path later.
 * @param lines 
 * @returns 
 */
export const getLinePath = (lines: Line[]): string => lines.map(mapLinePath).join(' ');

export const mapLinePath = ({ start, end }: Line): string => `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
