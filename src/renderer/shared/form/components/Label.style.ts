import styled from "@emotion/styled";
import { COLORS, Typography } from "../../theme";
import { alpha } from "@mui/material";

export const FormFieldLabel = styled(Typography)`
  color: ${COLORS.goldGlow};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.75rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background: linear-gradient(90deg, ${alpha(COLORS.ruddy, 0.5)}, transparent);
  }
`;
