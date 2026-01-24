// Get the x and y co-ordinates for the radius, circling clockwise.
export const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  // SVG angles usually start from the right (0°), but rituals often start from the top.
  // We subtract 90 to make 0° the "North" pole.
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};
