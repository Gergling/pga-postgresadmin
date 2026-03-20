import styled from "@emotion/styled";
import { COLORS } from "../../theme";

export const StyledFieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  min-inline-size: 0;
  min-width: 0;
`;

export const StyledLegend = styled.legend`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;

  font-size: 0.9rem;
  font-family: ${props => props.theme.typography.fontFamily};
  text-transform: uppercase;
  letter-spacing: 2px;

  color: ${COLORS.goldGlow};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
  }

  &::before {
    background: linear-gradient(to left, transparent, ${COLORS.bloodGlow});
  }

  &::after {
    background: linear-gradient(to right, transparent, ${COLORS.bloodGlow});
  }
`;
