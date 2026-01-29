import { Line } from "../types";

export const getLinePath = (lines: Line[]): string => lines.map(mapLinePath).join(' ');

export const mapLinePath = ({ start, end }: Line): string => `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
