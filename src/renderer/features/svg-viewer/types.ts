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

type BaseParams = {
  scale?: number;
  /**
   * In degrees.
   */
  rotation?: number;
  translation?: Point;
};
export type BaseResponse = { points: Point[]; type: 'lines'; };
export type PathFunction = (scale: number) => string;
export type PointFunction<ExtensionParams extends object = object> = (
  options: BaseParams & ExtensionParams
) => BaseResponse[];
export type LineFunction = (options: BaseParams) => Line[];

export type SvgLayer = React.SVGProps<SVGUseElement>;
export type NeonPlasmaGlowKey = 'halo' | 'structure' | 'core' | 'filament';
export type NeonPlasmaGlow = Record<NeonPlasmaGlowKey, SvgLayer>;
