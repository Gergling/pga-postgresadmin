import { BracketPosition } from "./types";

export const BRACKET_BASE = `
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-style: solid;
  border-width: 0;
`;

export const BRACKET_OPPOSITE_POSITION: Record<BracketPosition, BracketPosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};
