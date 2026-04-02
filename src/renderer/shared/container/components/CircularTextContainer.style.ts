import styled from "@emotion/styled";
import { alpha } from "@mui/material";

// export const CircularTextContainer = styled.div<{ color: string; }>(({ color }) => ({
export const CircularTextContainer = styled.div<{ color: string; }>(({ color }) => ({
  // width: 100px,
  // height: 100px;
  aspectRatio: '1 / 1',
  width: 'fit-content',    /* Grows only as wide as the text */
  padding: '0.7rem 1rem',
  border: `2px solid ${alpha(color, 0.6)}`,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  transition: 'all 0.2s ease-in-out',

  // '&:hover': {
  //   borderColor: alpha(color, 0.9),
  //   boxShadow: `0 0 12px ${alpha(color, 0.2)}`,
  // },
}));
