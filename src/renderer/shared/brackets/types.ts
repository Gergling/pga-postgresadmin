export type BracketVerticalPosition = 'top' | 'bottom';
export type BracketHorizontalPosition = 'left' | 'right';
export type BracketPosition = BracketVerticalPosition | BracketHorizontalPosition;
export type BracketDimension = 'horizontal' | 'vertical';

export type BracketPropsOptions = {
  size?: number;
  thickness?: number;
  roundness?: number;
};
