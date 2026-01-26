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
  corner: Point;
  opposite: Point;
};

export type PathFunction = (scale: number) => string;

export type SvgLayer = React.SVGProps<SVGUseElement>;
export type NeonPlasmaGlowKey = 'halo' | 'structure' | 'core' | 'filament';
export type NeonPlasmaGlow = Record<NeonPlasmaGlowKey, SvgLayer>;
