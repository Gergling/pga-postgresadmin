import { Stack } from "@mui/material";
import { Typography } from "../../theme";
import { HorizontalLine } from "../../common/components/HorizontalLine.style";

export const StackChip = (props: {
  label: React.ReactNode;
  value: React.ReactNode;
}) => <Stack style={{ flexBasis: 0, flexGrow: 1 }}>
  <Typography variant="h6">{props.label}</Typography>
  <HorizontalLine />
  <Typography variant="body1">{props.value}</Typography>
</Stack>;
