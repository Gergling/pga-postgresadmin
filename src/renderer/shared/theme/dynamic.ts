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
