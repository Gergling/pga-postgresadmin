export type Orientation = 'horizontal' | 'vertical' | 'both';

export type Point = {
  x: number;
  y: number;
};

export type Line = {
  start: Point;
  end: Point;
};

export type Box = {
  topLeft: Point;
  bottomRight: Point;
};

export type PathFunction = (scale: number) => string;
