import { PropsWithChildren } from "react";
import {
  ParentheticalHeadingText,
  ParentheticalHeadingBracketLine,
  ParentheticalHeadingContainer,
  ParentheticalBody
} from "./Heading.style";
import { ParentheticalHeadingBracketLineProps } from "../types";

export type ParentheticalHeadingProps =
  & PropsWithChildren
  & Omit<ParentheticalHeadingBracketLineProps, 'side'>
  & { heading: React.ReactNode };

export const ParentheticalHeading = ({ children, heading, ...props }: ParentheticalHeadingProps) => {
  return <div>
    <ParentheticalHeadingContainer>
      <ParentheticalHeadingBracketLine {...props} side="left" />
      <ParentheticalHeadingText>{heading}</ParentheticalHeadingText>
      <ParentheticalHeadingBracketLine {...props} side="right" />
    </ParentheticalHeadingContainer>
    <ParentheticalBody>{children}</ParentheticalBody>
  </div>;
};
