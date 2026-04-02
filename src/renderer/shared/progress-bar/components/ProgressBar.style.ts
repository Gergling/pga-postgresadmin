import styled from "@emotion/styled";
import { CSSProperties } from "react";

export const StyledProgressBarSegment = styled.div<{
  backgroundColor: CSSProperties['backgroundColor'];
  borderColor: CSSProperties['borderColor'];
  borderWidth: CSSProperties['borderWidth'];
  filter: CSSProperties['filter'];
  // width: CSSProperties['width'];
}>(({
  backgroundColor,
  borderColor,
  borderWidth = '2px',
  filter,
  // width,
}) => ({
  backgroundColor,
  borderColor,
  borderStyle: 'solid',
  borderWidth,
  filter,
  margin: '0.1rem',
  padding: '0.5rem',
  textAlign: 'center',
  transform: 'skew(-21deg)',
  // width,
}));
export const StyledProgressBar = styled.div({
  display: 'flex',
  justifyContent: 'stretch',
  gap: '0.4rem',
});
