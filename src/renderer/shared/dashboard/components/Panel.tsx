import { PanelDataItem } from "../types";
import { DashboardDeltaChip } from "./Delta";
import { DashboardSparkline } from "./Sparkline";
import { DashboardStackChip } from "./StackChip";

export const DashboardPanel = (props: PanelDataItem) => {
  switch (props.display) {
    case 'chip': return <DashboardStackChip {...props} />;
    case 'delta': return <DashboardDeltaChip {...props} />
    case 'sparkline': return <DashboardSparkline {...props} values={props.value} />;
  }
}
