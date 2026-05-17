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
  ${fadingLine({ height: size, thickness, color, direction: side })}

  /* The Vertical "Foot" */
  &::before {
    content: '';
    position: absolute;
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

