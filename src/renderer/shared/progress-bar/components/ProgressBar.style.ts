import styled from "@emotion/styled";
import { CSSProperties } from "react";

export const StyledProgressBarSegment = styled.div<{
  backgroundColor: CSSProperties['backgroundColor'];
  borderColor: CSSProperties['borderColor'];
  filter: CSSProperties['filter'];
  width: CSSProperties['width'];
}>(({
  backgroundColor,
  borderColor,
  filter,
  width,
}) => ({
  backgroundColor,
  borderColor,
  borderStyle: 'solid',
  borderWidth: '2px',
  filter,
  padding: '0.5rem',
  textAlign: 'center',
  transform: 'skew(-21deg)',
  width,
}));
export const StyledProgressBar = styled.div({
  display: 'flex',
  justifyContent: 'stretch',
  gap: '0.4rem',
});
