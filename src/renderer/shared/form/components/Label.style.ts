import styled from "@emotion/styled";
import { COLORS, Typography } from "../../theme";

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
    background: linear-gradient(90deg, rgba(255, 0, 51, 0.5), transparent);
  }
`;
