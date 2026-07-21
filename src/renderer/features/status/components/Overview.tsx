import { useMemo } from "react";
import { Grid } from "@mui/material";
import { Circle, DonutLarge, Memory, Storage } from "@mui/icons-material";
import { FirebaseDatabaseStatus } from "@/shared/lib/firebase";
import { ProgressBar } from "@/renderer/shared/progress-bar";
import { Slab } from "@/renderer/shared/base";
import { COLORS } from "@/renderer/shared/theme";
import { trpcReact } from "@/renderer/libs/react-query";
import { useFocus } from "@/renderer/shared/events";

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

// <SparkLineChart data={values} height={100} color={COLORS.goldGlow} />
// TODO: Could display system resource availability as sparklines when variable.

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

  // Update status
  useFocus({
    handleFocus: () => {
      // Attention should be set to Peripheral.
    },
    handleBlur: () => {
      // System check refetch interval can be increased to minutes.
      // Could include "alertness" system here, but only if it's worth doing.
      // Spike (instant check) when getting back focus or switching into this
      // view from another view.
      // Attention Levels:
      // Focus: Because it is actively being watched.
      // Peripheral: Because checks may need to be performed (e.g. in the
      // window behind).
      // Mute: No check is required. Possibly the application is minimised or
      // offline or something.
      // "Focus" level interval can be set to `focusInterval` for this operation.
      // The interval will gradually increase to that from a (pre-configured)
      // `minimumInterval`.
      // "Default" attention

      // For this specific component, we can consider a blur event to mute all
      // system checks.
      // Focus or pathname changes (switching into the view from another view)
      // doesn't apply because this is always on-screen.
      // Peripheral is the "default" for onFocus, but has a small refetch (e.g.
      // 5 seconds).
      // HOWEVER a spike followed by a Focus should be triggered if the internet
      // changes status recently (e.g. in the last minute or so). This could
      // mean 60 checks a minute if the internet is being tricky.
      // Also: This would constitute a "news" story, which would update the
      // dashboard.
    },
  });

  // // Refresh project local data when switching tabs within a project.
  // useEffect(() => {
  //   projectRefreshLocal();
  // }, [pathname])


  if (error) console.error(error);

  return <Slab>
    {(status === 'pending') && <ProgressBar />}
    <Grid container spacing={1}>
      {items.map((item, index) => <StatusItem key={index} {...item} />)}
    </Grid>
  </Slab>;
};
