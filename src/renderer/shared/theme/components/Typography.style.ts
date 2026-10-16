import styled from "@emotion/styled";
import { Typography as MuiTypography } from "@mui/material";
import { neonGlowStyle } from "../dynamic";
import { NeonShadowProps } from "../types";

export const Typography = styled(MuiTypography)<NeonShadowProps>((props) => ({
  fontFamily: '"Orbitron", sans-serif',
  ...neonGlowStyle({ ...props, shadow: { box: false } }),
}));
