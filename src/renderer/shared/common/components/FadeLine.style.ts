import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { COLORS } from '@/renderer/shared/theme';

export type FadeLineProps = {
  thickness?: number;
  color?: string;
  direction?: 'left' | 'right';
};

export const getFadeLine = ({
  thickness = 1,
  color = COLORS.bloodGlow,
  direction = 'left',
}: FadeLineProps) => css({
  borderTopColor: color,
  borderTopStyle: 'solid',
  borderTopWidth: thickness,
  flexGrow: 1,
  position: 'relative',
  
  /* The Fade */
  'mask-image': `linear-gradient(
    to ${direction === 'left' ? 'right' : 'left'}, 
    black 0%, 
    transparent 100%
  )`,
});

export const FadeLine = styled.div<FadeLineProps>(getFadeLine);
