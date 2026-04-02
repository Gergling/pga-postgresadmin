import { GUIDES } from "../config";
import { PathFunction } from "../types";
import { describeArc } from "../utilities";
import { getPathFire } from "./fire";
import { getPathMagicCircle } from "./magic-circle";

export const getPathYield: PathFunction = (scale) => {
  // const magicCircle = getPathMagicCircle(scale);
  const fire = getPathFire(
    scale
    // * GUIDES.innerRadius
  );

  return [
    // magicCircle,
    fire
  ].join(' ');
};
