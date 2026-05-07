/**
 * Seeds a number which outputs arbitrary but seed-deterministic numbers.
 * @param seed A number (possibly generated at random) which determines the
 * series of outputs.
 * @returns A function with no parameters which returns a number.
 */
export const hashFactory = (seed: number) => () => {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
