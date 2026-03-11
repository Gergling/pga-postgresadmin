import styled from "@emotion/styled";
import { Typography as MuiTypography } from "@mui/material";
import { neonTextShadow } from "../dynamic";
import { NeonShadowProps } from "../types";

export const Typography = styled(MuiTypography)<NeonShadowProps>`
  font-family: 'Orbitron', sans-serif;
  ${(props) => neonTextShadow(props)}
`;
