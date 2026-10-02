import { DashboardStackChip } from "./StackChip";
import { DashboardValueDelta } from "./Value";

export const DashboardDeltaChip = (
  { label, value }: {
    label: React.ReactNode;
    value: number;
  }
) => (
  <DashboardStackChip
    label={label}
    value={<DashboardValueDelta value={value} />}
  />
);
