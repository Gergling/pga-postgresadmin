import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Button } from '@mui/material';
import { DiaryEntryStatus } from '../../../../shared/features/diary/types';

const pulse = keyframes`
  0% { box-shadow: 0 0 5px #00f2ff; }
  50% { box-shadow: 0 0 20px #00f2ff; }
  100% { box-shadow: 0 0 5px #00f2ff; }
`;

const getTextPulse = (color: string) => keyframes`
  0% { text-shadow: 0 0 5px ${color}; }
  50% { text-shadow: 0 0 20px ${color}; }
  100% { text-shadow: 0 0 5px ${color}; }
`;

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
// Probably best aim for top/bottom brackets.
// Give them some glow shadow.
// TODO: Get this from the CSS style values.
type Position = 'top' | 'bottom' | 'left' | 'right';
type Dimension = 'horizontal' | 'vertical';
const oppositePosition: Record<Position, Position> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};
const bracket = (
  position: Position,
  color: string,
  {
    size = 20,
    thickness = 3,
  }
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
      border-${position}-width: ${thickness}px;
      ${perpendicular.map(p => `border-${p}-width: ${thickness}px;`).join('')}
      ${opposite}: unset;
      filter: drop-shadow(0 0 10px ${color});
    }
  `;
};
const brackets = (
  dimension: Dimension,
  color: string,
  {
    size = 20,
    thickness = 3,
  }
) => {
  const positions: Position[] = dimension === 'horizontal' ? ['left', 'right'] : ['top', 'bottom'];
  return positions.map(p => bracket(p, color, { size, thickness })).join('');
};
const cornerBracket = (x: 'left' | 'right', y: 'top' | 'bottom', color: string) => `
  &::${y === 'top' ? 'before' : 'after'} {
    ${bracketBase}
    ${y}: -2px;
    ${x}: -2px;
    width: 20px;
    height: 20px;
    border-${y}: 3px solid ${color};
    border-${x}: 3px solid ${color};
    filter: drop-shadow(0 0 5px ${color});
  }
`;

// TODO: Possibly abstracted at this point.
export const RectangularBracket = styled.div<{
  color: string;
  position: Position;
  size?: number;
  thickness?: number;
}>`
  position: relative;
  ${(({ color, position, size = 20, thickness = 3 }) => bracket(position, color, { size, thickness }))}
`;
export const RectangularBracketContainer = styled.div<{
  color: string;
  dimension?: Dimension;
  size?: number;
  thickness?: number;
}>`
  position: relative;
  ${(({ color, dimension = 'horizontal', size = 20, thickness = 3 }) => brackets(dimension, color, { size, thickness }))}
`;

export const StyledDiaryEntryItemContainer = styled.div`
  position: relative;
  padding: 20px;
  margin-bottom: 0.5rem;
  background: rgba(40, 0, 0, 0.8); /* Deep Blood Red Translucent */
`;
// border: 1px solid ${props => {
//   switch(props.status) {
//     case 'committed': return '#ffd700'; // Gold (Convergence fuel)
//     case 'processing': return '#00f2ff'; // Cyan (Active triage)
//     case 'processed': return '#4caf50';  // Green (Manifested)
//     default: return '#333';
//   }
// }};
export const StyledDiaryEntryItem = styled.div<{ status: DiaryEntryStatus | undefined; }>`
  opacity: ${props => props.status === 'processed' ? 0.6 : 1};
  animation: ${props => props.status === 'processing' ? `${pulse} 2s infinite` : 'none'};
  transition: all 0.3s ease-in-out;
  padding: 1rem;
  // margin-bottom: 0.5rem;
  position: relative;
  color: ${({ theme }) => theme.colors.primary.on};
  // background: ${({ theme }) => theme.colors.primary.main}55;

  display: flex;
  gap: 0.5rem;
  justify-content: space-between;


  // background: rgba(40, 0, 0, 0.8); /* Deep Blood Red Translucent */
  /* The Polygon: Top-left, Top-right, Bottom-right, Bottom-left */
  /* We cut 15px off the top-right and bottom-left corners */
  // clip-path: polygon(
  //   0% 0%, 
  //   calc(100% - 15px) 0%, 
  //   100% 15px, 
  //   100% 100%, 
  //   15px 100%, 
  //   0% calc(100% - 15px)
  // );
  // color: #ffcc00; /* Alchemist Gold */
  // border: 1px solid #700; /* Subtle base border */
`;

export const StyledStatus = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  animation: ${({ theme }) => getTextPulse(theme.colors.primary.main)} 2s infinite;
`;
export const StyledButton = styled(Button)`
  // background: ${({ theme }) => theme.colors.primary.main};
`;

export const StyledBody = styled.div`
  padding: 1rem;
  flex: 1;
  min-width: 0;
`;

export const StyledControls = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;

  flex-shrink: 0; /* The "Indestructible" flag */
  width: 120px;   /* Your fixed width */
  margin-left: 1rem;
`;

// A styled component that injects a dynamic SVG background
export const CyberPanel = styled.div<{ status: string }>`
  --ritual-color: ${props => props.status === 'processing' ? '#00f2ff' : '#d40000'};
  
  background-color: #0a0101;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10L90 10L90 90L10 90Z' fill='none' stroke='%23${props => props.status === 'processing' ? '00f2ff' : 'd40000'}' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E");
  background-repeat: repeat;
`;