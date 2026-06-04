import { Stack } from "@mui/material";
import { Typography } from "../../theme";
import { HorizontalLine } from "../../common/components/HorizontalLine.style";
import { DashboardPanelLabel } from "./Label";

export const DashboardStackChip = (props: {
  label: React.ReactNode;
  value: React.ReactNode;
}) => <Stack style={{ flexBasis: 0, flexGrow: 1 }}>
  <DashboardPanelLabel>{props.label}</DashboardPanelLabel>
  <HorizontalLine />
  <Typography variant="h4">{props.value}</Typography>
</Stack>;
