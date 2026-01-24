const defaultSize = 100;

const scale = (value: number, by = defaultSize) => value * by;
export const scaleRadius = (value: number, size = defaultSize) => scale(value, size);
