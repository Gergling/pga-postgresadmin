import { neonFilterDropShadow } from "../theme";
import { BRACKET_BASE, BRACKET_OPPOSITE_POSITION } from "./constants";
import { BracketDimension, BracketHorizontalPosition, BracketPosition, BracketPropsOptions, BracketVerticalPosition } from "./types";

export const getBorderRadiusStyles = (position: BracketPosition, roundness: number) => {
  return ['top', 'bottom'].reduce(
    (acc, vertical) => ['left', 'right'].reduce(
      (acc, horizontal) => [
        ...acc,
        `border-${vertical}-${horizontal}-radius: ${position === vertical || position === horizontal ? roundness : 0}px;`,
      ],
      acc
    ),
    []
  ).join('\n');
};

export const getBracketPseudoStyles = (
  position: BracketPosition,
  color: string,
  {
    size = 20,
    thickness = 3,
    roundness = 0,
  }: BracketPropsOptions
) => {
  const pseudo = position === 'top' || position === 'left' ? 'before' : 'after';
  const dimension = position === 'top' || position === 'bottom' ? 'height' : 'width';
  const perpendicular = position === 'top' || position === 'bottom' ? ['left', 'right'] : ['top', 'bottom'];
  const opposite = BRACKET_OPPOSITE_POSITION[position];
  return `
    &::${pseudo} {
      ${BRACKET_BASE}
      ${position}: -2px;
      ${dimension}: ${size}px;
      border-color: ${color};
      border-radius: ${roundness}px;
      ${getBorderRadiusStyles(position, roundness)}
      border-${position}-width: ${thickness}px;
      ${perpendicular.map(p => `border-${p}-width: ${thickness}px;`).join('')}
      ${opposite}: unset;
      filter: ${neonFilterDropShadow(color)};
    }
  `;
};

export const getBracketsPseudoStyles = (
  dimension: BracketDimension,
  color: string,
  options: BracketPropsOptions,
) => {
  const positions: BracketPosition[] = dimension === 'horizontal' ? ['left', 'right'] : ['top', 'bottom'];
  return positions.map(p => getBracketPseudoStyles(p, color, options)).join('');
};

export const cornerBracket = (x: BracketHorizontalPosition, y: BracketVerticalPosition, color: string) => `
  &::${y === 'top' ? 'before' : 'after'} {
    ${BRACKET_BASE}
    ${y}: -2px;
    ${x}: -2px;
    // width: 20px;
    // height: 20px;
    border-${y}: 3px solid ${color};
    border-${x}: 3px solid ${color};
    filter: ${neonFilterDropShadow(color)};
  }
`;
