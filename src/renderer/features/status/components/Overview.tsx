import { useMemo } from "react";
import { Grid } from "@mui/material";
import { Circle, DonutLarge, Memory, Storage } from "@mui/icons-material";
import { FirebaseDatabaseStatus } from "@/shared/lib/firebase";
import { ProgressBar } from "@/renderer/shared/progress-bar";
import { trpcReact } from "@/renderer/libs/react-query";
import { Slab } from "@/renderer/shared/base";
import { COLORS } from "@/renderer/shared/theme";


type StatusDatabaseProps = { type: 'database'; value: FirebaseDatabaseStatus; };
const StatusDatabase = ({ value }: StatusDatabaseProps) => <Slab
  color={value === 'initialised' ? COLORS.goldGlow : COLORS.bloodRed}
><Circle /></Slab>;
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
    data: resources, error, status
  } = trpcReact.system.checkResourceSubscription.useSubscription();
  const {
    data: statusData, error: statusError, status: statusStatus
  } = trpcReact.system.checkDatabaseStatus.useSubscription();
  const items = useMemo((): StatusItemProps[] => {
    if (!resources || !statusData) return [];
    return [
      { type: 'database', value: statusData },
      { type: 'cpu', value: resources.cpuAvailable },
      { type: 'memory', value: resources.memoryFreePercentage },
    ];
  }, [resources, statusData]);

  if (error) console.error(error);
  if (statusError) console.error(statusError);

  return <Slab>
    {(status === 'connecting' || statusStatus === 'connecting') && <ProgressBar />}
    <Grid container spacing={1}>
      {items.map((item, index) => <StatusItem key={index} {...item} />)}
    </Grid>
  </Slab>;
};
