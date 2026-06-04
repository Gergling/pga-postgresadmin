import { Stack } from "@mui/material";
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { COLORS } from "../../theme";
import { DashboardPanelLabel } from "./Label";

export const DashboardSparkline = ({ label, values }: {
  label: string; values: number[]
}) => {
  return (
    <Stack style={{ flexBasis: 0, flexGrow: 1 }}>
      <DashboardPanelLabel>{label}</DashboardPanelLabel>
      <SparkLineChart data={values} height={100} color={COLORS.goldGlow} />
    </Stack>
  );
};
