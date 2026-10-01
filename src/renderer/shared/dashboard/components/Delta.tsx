import { TrendingDown, TrendingFlat, TrendingUp } from "@mui/icons-material";
import { DashboardStackChip } from "./StackChip";

const DeltaIcon = ({ value }: { value: number; }) => {
  if (value > 0) return <TrendingUp />;
  if (value < 0) return <TrendingDown />;
  return <TrendingFlat />;
};

export const DashboardDeltaChip = ({ value, ...props }: {
  label: React.ReactNode;
  value: number;
}) => <DashboardStackChip
    {...props}
    value={<><DeltaIcon value={value} /> {value}</>}
  />;
