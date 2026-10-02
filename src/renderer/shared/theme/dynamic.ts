import { CSSProperties } from "@mui/material";
import { COLORS } from "./colors";
import { NeonShadowProps, NeonShadowResponse } from "./types";

/**
 * @deprecated Use `neonGlowStyle` instead.
 */
export const neonFilterDropShadow = (
  color: string = COLORS.bloodGlow
) => `drop-shadow(0 0 20px ${color})`;

/**
 * @deprecated Use `neonGlowStyle` instead.
 */
export const neonBoxShadow = ({
  blur = '15px',
  color = COLORS.bloodGlow
}: NeonShadowProps) => `box-shadow: 0 0 ${blur} ${color};`;

/**
 * @deprecated Use `neonGlowStyle` instead.
 */
export const neonTextShadow = ({
  blur = '5px',
  color = COLORS.bloodGlow
}: NeonShadowProps) => `text-shadow: 0 0 ${blur} ${color};`;

export const neonGlowStyle = ({
  blur = '15px',
  color = COLORS.bloodGlow,
  shadow: {
    box = true,
    filter,
    text,
  } = { box: true },
}: NeonShadowProps): NeonShadowResponse => ({
  boxShadow: box ? `0 0 ${blur} ${color}` : undefined,
  filter: filter ? `drop-shadow(0 0 ${blur} ${color})` : undefined,
  textShadow: text ? `0 0 ${blur} ${color}` : undefined,
});

export type FadingLineProps = {
  height?: number;
  thickness?: number;
  color?: string;
  direction?: 'left' | 'right';
};

export const fadingLine = ({
  height = 20,
  thickness = 1,
  color = COLORS.bloodGlow,
  direction = 'left',
}: FadingLineProps) => `
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
