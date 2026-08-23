import { Typography } from "@/renderer/shared/theme";
import { StackChip } from "@/renderer/shared/base";
import { DashboardPanelLabel } from "./Label";

export const DashboardStackChip = (props: {
  label: React.ReactNode;
  value: React.ReactNode;
}) => <StackChip
    label={<DashboardPanelLabel>{props.label}</DashboardPanelLabel>}
    value={<Typography variant="h4">{props.value}</Typography>}
  />;
