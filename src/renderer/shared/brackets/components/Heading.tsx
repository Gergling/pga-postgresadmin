import { PropsWithChildren } from "react";
import {
  ParentheticalHeadingText,
  ParentheticalHeadingBracketLine,
  ParentheticalHeadingContainer,
  ParentheticalBody
} from "./Heading.style";

export const ParentheticalHeading = ({ children, heading }: PropsWithChildren & { heading: React.ReactNode }) => {
  return <div>
    <ParentheticalHeadingContainer>
      <ParentheticalHeadingBracketLine side="left" />
      <ParentheticalHeadingText>{heading}</ParentheticalHeadingText>
      <ParentheticalHeadingBracketLine side="right" />
    </ParentheticalHeadingContainer>
    <ParentheticalBody>{children}</ParentheticalBody>
  </div>;
};
