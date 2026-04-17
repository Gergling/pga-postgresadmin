import styled from "@emotion/styled";
import { alpha } from "@mui/material";
import { COLORS } from "../../theme";

export const Hazard = styled.div`
  height: 30px;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      ${alpha(COLORS.bloodGlow, 0.5)} 10px,
      ${alpha(COLORS.bloodGlow, 0.5)} 20px
    ), linear-gradient(
      to bottom,
      ${alpha(COLORS.bloodRed, 0.6)},
      transparent
    );
  }
`;
