import styled from '@emotion/styled';
import { BracketDimension, BracketPosition, BracketPropsOptions } from "../types";
import { COLORS } from '../../theme/colors';
import { neonFilterDropShadow } from '../../theme/dynamic';

// Make a version of this which doesn't create error logs.
// Also doesn't live here.
// const pulse = keyframes`
//   0% { box-shadow: 0 0 5px #00f2ff; }
//   50% { box-shadow: 0 0 20px #00f2ff; }
//   100% { box-shadow: 0 0 5px #00f2ff; }
// `;

// const getTextPulse = (color: string) => keyframes`
//   0% { text-shadow: 0 0 5px ${color}; }
//   50% { text-shadow: 0 0 20px ${color}; }
//   100% { text-shadow: 0 0 5px ${color}; }
// `;


const bracketBase = `
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-style: solid;
  border-width: 0;
`;
const oppositePosition: Record<BracketPosition, BracketPosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const getBorderRadius = (position: BracketPosition, roundness: number) => {
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
const bracket = (
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
  const opposite = oppositePosition[position];
  return `
    &::${pseudo} {
      ${bracketBase}
      ${position}: -2px;
      ${dimension}: ${size}px;
      border-color: ${color};
      border-radius: ${roundness}px;
      ${getBorderRadius(position, roundness)}
      border-${position}-width: ${thickness}px;
      ${perpendicular.map(p => `border-${p}-width: ${thickness}px;`).join('')}
      ${opposite}: unset;
      filter: ${neonFilterDropShadow(color)};
    }
  `;
};
const brackets = (
  dimension: BracketDimension,
  color: string,
  options: BracketPropsOptions,
) => {
  const positions: BracketPosition[] = dimension === 'horizontal' ? ['left', 'right'] : ['top', 'bottom'];
  return positions.map(p => bracket(p, color, options)).join('');
};

export const Parenthesis = styled.div<{
  color?: string;
  position?: BracketPosition;
} & BracketPropsOptions>`
  position: relative;
  ${(({ color = COLORS.bloodGlow, position = 'top', size = 20, thickness = 3, roundness = 40 }) => bracket(position, color, { roundness, size, thickness }))}
`;

export const ParentheticalContainer = styled.div<{
  color?: string;
  dimension?: BracketDimension;
} & BracketPropsOptions>`
  position: relative;
  ${(({
    color = COLORS.bloodGlow, dimension = 'horizontal', size = 20, thickness = 3, roundness = 40
  }) => brackets(dimension, color, { roundness, size, thickness }))}
`;
