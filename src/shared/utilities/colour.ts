import { interpolate } from "./maths";

const red = 0;
const green = 120;

export const interpolateHue = (
  value: number,
  minimum: number,
  maximum: number
) => {
  const hue = interpolate(value, minimum, maximum, red, green);
  const rounded = Math.round(hue);
  return rounded;
};
