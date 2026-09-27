import { TypographyProps } from "@mui/material";
import { StackChip, StackChipProps } from "@/renderer/shared/base";
import { Typography } from "@/renderer/shared/theme";

export const AiChip = (
  {
    label, value, variant, ...props
  }: StackChipProps & Pick<TypographyProps, 'variant'>
) => <StackChip
    label={<Typography variant={variant ?? 'body2'}>{label}</Typography>}
    value={value}
    alignItems={'center'}
    {...props}
  />;
