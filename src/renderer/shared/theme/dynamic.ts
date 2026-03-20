import { COLORS } from "./colors";
import { NeonShadowProps } from "./types";

export const neonFilterDropShadow = (color: string = COLORS.bloodGlow) => `drop-shadow(0 0 20px ${color})`;

export const neonBoxShadow = ({
  blur = '15px',
  color = COLORS.bloodGlow
}: NeonShadowProps) => `box-shadow: 0 0 ${blur} ${color};`;

export const neonTextShadow = ({
  blur = '5px',
  color = COLORS.bloodGlow
}: NeonShadowProps) => `text-shadow: 0 0 ${blur} ${color};`;

export const fadingLine = ({
  height = 20,
  thickness = 1,
  color = COLORS.bloodGlow,
  direction = 'left',
}: {
  height?: number;
  thickness?: number;
  color?: string;
  direction?: 'left' | 'right';
}) => `
  flex-grow: 1;
  height: ${height}px;
  border-top-color: ${color};
  border-top-style: solid;
  border-top-width: ${thickness}px;
  position: relative;
  
  /* The Fade */
  mask-image: linear-gradient(
    to ${direction === 'left' ? 'right' : 'left'}, 
    black 0%, 
    transparent 100%
  );
`;
