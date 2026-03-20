import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { COLORS, fadingLine } from "../../theme";
import { ParentheticalHeadingBracketLineProps } from "../types";

export const ParentheticalHeadingBracketLine = styled.div<ParentheticalHeadingBracketLineProps>(({
  color = COLORS.bloodGlow,
  roundness = 0,
  side,
  size = 20,
  thickness = 3,
}) => `
  flex-grow: 1;
  height: ${size}px;
  border-top-color: ${color};
  border-top-style: solid;
  border-top-width: ${thickness}px;
  position: relative;
  
  /* The Fade */
  mask-image: linear-gradient(
    to ${side === 'left' ? 'right' : 'left'}, 
    black 0%, 
    transparent 100%
  );

  ${fadingLine({ height: size, thickness, color, direction: side })}

  /* The Vertical "Foot" */
  &::before {
    content: '';
    position: absolute;
    // top: 50%;
    // transform: translateY(-50%);
    ${side === 'left' ? 'left: 0;' : 'right: 0;'}
    height: ${size}px;
    width: ${thickness}px;
    background: ${color };
    border-radius: ${roundness}px;
  }
`);

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

