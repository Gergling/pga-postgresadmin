import styled from "@emotion/styled";
import { alpha, Button as MuiButton } from "@mui/material";
import { COLORS, neonBoxShadow, neonTextShadow } from "../../theme";

export const Button = styled(MuiButton)`
  background: transparent;
  color: ${COLORS.ruddy};
  border: 1px solid ${COLORS.ruddy};
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  margin-top: 24px;
  transition: all 0.3s ease;
  ${neonTextShadow({ color: alpha(COLORS.ruddy, 0.5) })}

  &:hover {
    background: ${alpha(COLORS.ruddy, 0.1)};
    border-color: ${COLORS.ruddy};
    ${neonBoxShadow({ blur: '15px', color: alpha(COLORS.ruddy, 0.4) })}
    color: ${COLORS.white};
    ${neonTextShadow({ color: alpha(COLORS.white, 0.5) })}
  }
`;
