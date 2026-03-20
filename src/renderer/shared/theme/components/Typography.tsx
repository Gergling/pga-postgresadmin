import { TypographyProps } from "@mui/material";
import { Typography } from "./Typography.style";
import { NeonShadowProps } from "../types";

export const H4 = ({
  children,
  ...props
}: TypographyProps & NeonShadowProps) => <Typography
  sx={{
    fontSize: '1.05rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  }}
  variant="h4"
  {...props}
>{children}</Typography>;

export const H6 = ({
  children,
  ...props
}: TypographyProps & NeonShadowProps) => <Typography
  sx={{
    fontSize: '0.85rem',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  }}
  variant="h6"
  {...props}
>{children}</Typography>;
