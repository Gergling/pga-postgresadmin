import styled from "@emotion/styled";
import { Block } from "../../base";
import { fadingLine, FadingLineProps } from "../../theme";

export const HorizontalLine = styled(Block)<Omit<FadingLineProps, 'direction'>>`
  height: ${(props) => props.height ?? 1}px;
  display: flex;

  &::before {
    content: '';
    ${(props) => fadingLine({ ...props, direction: 'right' })}
  }
  &::after {
    content: '';
    ${(props) => fadingLine({ ...props, direction: 'left' })}
  }
`;
