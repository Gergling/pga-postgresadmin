import styled from "@emotion/styled";
import { COLORS } from "../../theme";

/**
 * Generic surface component for writing on. Includes cosmetic scanlines.
 */
export const Slab = styled.div`
  color: ${COLORS.bloodGlow};

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
    backgroundSize: '100% 2px, 3px 100%',
    pointerEvents: 'none',
    zIndex: 1,
  },

`;
