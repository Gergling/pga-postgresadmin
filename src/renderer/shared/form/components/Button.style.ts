import styled from "@emotion/styled";
import { alpha, Button as MuiButton } from "@mui/material";
import { COLORS, neonBoxShadow } from "../../theme";

export const Button = styled(MuiButton)`
  background: transparent;
  color: ${COLORS.ruddy};
  border: 1px solid ${COLORS.ruddy};
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  margin-top: 24px;
  transition: all 0.3s ease;

  &:hover {
    background: ${alpha(COLORS.ruddy, 0.1)};
    border-color: ${COLORS.ruddy};
    ${neonBoxShadow({ blur: '15px', color: alpha(COLORS.ruddy, 0.4) })}
    color: #fff;
  }
`;
