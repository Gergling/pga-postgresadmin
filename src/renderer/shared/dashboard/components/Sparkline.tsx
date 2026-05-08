import { Stack, Typography } from "@mui/material";
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export const DashboardSparkline = ({ label, values }: {
  label: string; values: number[]
}) => {
  return (
    <Stack style={{ flexBasis: 0, flexGrow: 1 }}>
      <Typography variant="h6">{label}</Typography>
      <SparkLineChart data={values} height={100} />
    </Stack>
  );
};
