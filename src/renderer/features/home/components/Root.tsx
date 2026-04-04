import { Grid, GridProps } from "@mui/material";
import { Diary } from "../../diary";
import { EmailSyncPanel } from "../../email/components/EmailSyncPanel";
import { Slab } from "@/renderer/shared/base";
import { StackChip } from "@/renderer/shared/dashboard";

const DashboardPanel = ({ children, ...props }: GridProps) => {
  return <Grid {...props} sx={{ textAlign: 'center' }}>
    <Slab>
      {children}
    </Slab>
  </Grid>
};

export const HomeRoot = () => {
  return <div>
    <Grid container>
      <DashboardPanel size={{ xs: 12, md: 4 }}>
        <StackChip label={'label'} value={'value'} />
      </DashboardPanel>
      <DashboardPanel size={{ xs: 12, md: 4 }}>
        <StackChip label={'label'} value={'value'} />
      </DashboardPanel>
      <DashboardPanel size={{ xs: 12, md: 4 }}>
        <StackChip label={'label'} value={'value'} />
      </DashboardPanel>
    </Grid>
    <EmailSyncPanel />
    <Diary />
  </div>
};
