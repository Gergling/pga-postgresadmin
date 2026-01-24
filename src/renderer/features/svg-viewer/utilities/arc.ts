import { polarToCartesian } from "./cartesian";

/**
 * Generates an SVG Path string for an arc.
 * @param startAngle - Starting degree (0 is Top)
 * @param endAngle - Ending degree (e.g., 60 for a 60° arc)
 */
export const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  {
    largeArc = false,
  }: {
    largeArc?: boolean;
  } = {}
) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  // If the arc is greater than 180 degrees, the 'large-arc-flag' must be 1.
  const largeArcFlag = largeArc ? "1" : "0";

  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
};
