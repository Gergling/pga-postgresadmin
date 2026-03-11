import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { COLORS } from "../../theme";
import { BracketHorizontalPosition, BracketPropsOptions } from "../types";

export const ParentheticalHeadingBracketLine = styled.div<BracketPropsOptions & {
  side: BracketHorizontalPosition;
  color?: string;
}>`
  flex-grow: 1;
  height: ${props => props.size ?? 20}px;
  border-top-color: ${props => props.color ?? COLORS.bloodGlow};
  border-top-style: solid;
  border-top-width: ${props => props.thickness ?? 3}px;
  position: relative;
  
  /* The Fade */
  mask-image: linear-gradient(
    to ${props => props.side === 'left' ? 'right' : 'left'}, 
    black 0%, 
    transparent 100%
  );

  /* The Vertical "Foot" */
  &::before {
    content: '';
    position: absolute;
    // top: 50%;
    // transform: translateY(-50%);
    ${props => props.side === 'left' ? 'left: 0;' : 'right: 0;'}
    height: ${props => props.size ?? 20}px;
    width: ${props => props.thickness ?? 3}px;
    background: ${props => props.color ?? COLORS.bloodGlow };
    border-radius: ${props => props.roundness ?? 0}px;
  }
`;

export const ParentheticalHeadingContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const ParentheticalHeadingText = styled(Typography)`
  font-family: 'Orbitron', sans-serif;
  color: ${COLORS.goldGlow};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.75rem;
  transform: translateY(-50%);
`;

export const ParentheticalBody = styled.div`
  padding: 0 20px;
`;

