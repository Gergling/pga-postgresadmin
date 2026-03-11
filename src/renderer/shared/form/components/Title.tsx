import { PropsWithChildren } from "react";
import { COLORS, H6 } from "../../theme";
import { StyledFormTitleContainer } from "./Title.style";

export const FormTitle = ({ children }: PropsWithChildren) => {
  return <StyledFormTitleContainer roundness={0}>
    <H6 color={COLORS.goldGlow}>{children}</H6>
  </StyledFormTitleContainer>;
};
