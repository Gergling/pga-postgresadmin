import styled from "@emotion/styled";
import { CSSProperties } from "react";
import { COLORS, neonBoxShadow } from "../../theme";
import { alpha, css, keyframes } from "@mui/material";

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

export const StyledProgressBarBooleanContainer = styled.div({
  height: '4px',
  position: 'relative',
  width: '100%',
  backgroundColor: alpha(COLORS.bloodRed, 0.8),
}, css(neonBoxShadow({})));

const StyledProgressBarBase = css({
  height: '100%',
  position: 'absolute',
  background: `linear-gradient(
    to bottom,
    ${COLORS.ruddy},
    ${COLORS.bloodRed}
  )`,
  '&::after': {
    content: '""',
    position: 'absolute',
    height: '20%',
    top: '10%',
    left: '2px',
    right: '2px',
    background: `#ffffff77`
  },
});

export const StyledProgressBarBoolean = styled.div({
  ...StyledProgressBarBase,
  // width: `60%`,
});

const lateralMove = keyframes`
  0% { transform: translateX(-20%); }
  100% { transform: translateX(80%); }
`;

export const StyledProgressBarAnimated = styled.div({
  ...StyledProgressBarBase,
  width: '40%',
  left: '30%',
  animation: `${lateralMove} 2s ease-in-out alternate`,
});
