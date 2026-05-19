import { useMemo } from "react";
import { Grid } from "@mui/material";
import { Circle, DonutLarge, Memory, Storage } from "@mui/icons-material";
import { FirebaseDatabaseStatus } from "@/shared/lib/firebase";
import { ProgressBar } from "@/renderer/shared/progress-bar";
import { Slab } from "@/renderer/shared/base";
import { COLORS } from "@/renderer/shared/theme";
import { trpcReact } from "@/renderer/libs/react-query";

// TODO: Colour-coding:
// Below 85% memory is dark green or blue.
// Above 90% memory is bright red, probably pulsing orange.
// The remaining is just gold.

type StatusDatabaseProps = { type: 'database'; value: FirebaseDatabaseStatus; };
const StatusDatabase = ({ value }: StatusDatabaseProps) => <Circle
  htmlColor={value === 'initialised' ? COLORS.goldGlow : COLORS.bloodRed}
/>;
type StatusResourcesProps = { type: 'cpu' | 'memory'; value: number; };
const StatusResources = ({ value }: StatusResourcesProps) => <ProgressBar
  value={value} style={{ transform: 'translateY(-50%)' }}
/>
type StatusItemProps = StatusDatabaseProps | StatusResourcesProps;

const StatusItemValue = (props: StatusItemProps) => {
  switch (props.type) {
    case 'cpu':
    case 'memory':
      return <StatusResources {...props} />;
    case 'database':
      return <StatusDatabase {...props} />;
    default:
      return null;
  }
};

const createIconConfig = <
  T extends Record<StatusItemProps['type'], React.ReactNode>,
>(config: T) => config;

const icons = createIconConfig({
  cpu: <Memory />,
  database: <Storage />,
  memory: <DonutLarge />,
});

const StatusItem = (props: StatusItemProps) => {
  return <Grid
    container size={{ xs: 2, md: 1 }} spacing={1} alignItems={'center'}
  >
    <Grid size={'auto'}>{icons[props.type]}</Grid>
    <Grid size={'grow'}>
      <StatusItemValue {...props} />
    </Grid>
  </Grid>;
};

export const StatusOverview = () => {
  const {
    data, error, status
  } = trpcReact.system.check.useQuery(undefined, { refetchInterval: 5000 });
  const items = useMemo((): StatusItemProps[] => {
    const { db: statusData, resources } = data ?? {};
    if (!resources || !statusData) return [];
    return [
      { type: 'database', value: statusData },
      { type: 'cpu', value: resources.cpuAvailable },
      { type: 'memory', value: resources.memoryFreePercentage },
    ];
  }, [data]);

  if (error) console.error(error);

  return <Slab>
    {(status === 'pending') && <ProgressBar />}
    <Grid container spacing={1}>
      {items.map((item, index) => <StatusItem key={index} {...item} />)}
    </Grid>
  </Slab>;
};
