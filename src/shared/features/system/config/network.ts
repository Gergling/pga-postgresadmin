// 20, 40, 80, 160ms
// const xyz = (latency: number) => {
//   Math.log2(latency / 20)
// };
// Choose hues to scale between. Standard is ofc green to red, but blue makes
// an acceptable "cooling" ping latency.

// Values are in ms.
export const reliability: Record<'min' | 'max', {
  colour: { h: number; s: number; l: number; };
  value: number;
}> = {
  max: {
    colour: { h: 120, s: 100, l: 20 },
    value: 0,
  },
  min: {
    colour: { h: 0, s: 100, l: 50 },
    value: 20,
  }
};
