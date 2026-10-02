import { SparkLineChart } from "@mui/x-charts";
import { Grid } from "@mui/material";
import { useMemo } from "react";
import { useTheme } from "@gergling/ui-components";
import { COLORS, neonGlowStyle, Typography } from "../../theme";
import {
  PanelDataItem,
  PanelDataValueChip,
  PanelDataValueDelta,
  PanelDataValueSparkline
} from "../types";
import { getDeltaConfig } from "../utilities";

const ChipValue = ({ value }: Pick<PanelDataValueChip, 'value'>) => {
  return <Typography variant="h4">{value}</Typography>
}

export const DashboardValueDelta = (
  props: Pick<PanelDataValueDelta, 'value'>
) => {
  const { theme: { colors } } = useTheme();
  const {
    icon: DeltaIcon,
    sign,
    color,
  } = useMemo(() => {
    const config = getDeltaConfig(props.value);
    return {
      ...config,
      color: colors[config.color].main,
    };
  }, [props.value]);
  return <Grid container>
    <Grid size={4}><Typography sx={{
      ...neonGlowStyle({ color }),
    }} variant="h6">{sign}</Typography></Grid>
    <Grid size={4}><Typography variant="h6">{props.value}</Typography></Grid>
    <Grid size={4}>{DeltaIcon}</Grid>
  </Grid>
}

const SparkLine = (
  { value }: Pick<PanelDataValueSparkline, 'value'>
) => <SparkLineChart
    color={COLORS.goldGlow}
    data={value}
  />;

export const DashboardValue = (props: PanelDataItem) => {
  switch (props.display) {
    case 'chip': return <ChipValue {...props} />;
    case 'delta': return <DashboardValueDelta {...props} />;
    case 'sparkline': return <SparkLine {...props} />;
  }
}
