import { PropsWithChildren } from "react";
import { COLORS, H4 } from "../../theme";
import { StyledFormTitleContainer } from "./Title.style";

export const FormTitle = ({ children }: PropsWithChildren) => {
  return <StyledFormTitleContainer roundness={0}>
    <H4 color={COLORS.goldGlow}>{children}</H4>
  </StyledFormTitleContainer>;
};
