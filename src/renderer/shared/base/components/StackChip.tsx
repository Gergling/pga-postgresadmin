import { Stack, StackProps } from "@mui/material";
import { HorizontalLine } from "@/renderer/shared/common";

export type StackChipProps = StackProps & {
  label: React.ReactNode;
  value: React.ReactNode;
};
export const StackChip = (
  { label, value, ...props }: StackChipProps
) => <Stack
  flexBasis={0} flexGrow={1} {...props}
>{label}<HorizontalLine style={{ width: '100%' }} />{value}</Stack>;
