import { TypographyProps } from "@mui/material";
import { Typography } from "./Typography.style";
import { NeonShadowProps } from "../types";

export const H6 = ({
  children,
  ...props
}: TypographyProps & NeonShadowProps) => <Typography
  sx={{
    fontSize: '1.05rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  }}
  variant="h6"
  {...props}
>{children}</Typography>;
