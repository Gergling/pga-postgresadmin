import { PropsWithChildren } from "react";
import { Typography } from "../../theme";

export const DashboardPanelLabel = ({
  children
}: PropsWithChildren) => <Typography
  sx={{ fontSize: '1rem' }}
  variant="h6"
>{children}</Typography>;
