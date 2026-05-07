import { Grid, GridProps } from "@mui/material";
import { Diary, useDiaryPanels } from "../../diary";
import { EmailSyncPanel } from "../../email/components/EmailSyncPanel";
import { Slab } from "@/renderer/shared/base";
import { StackChip } from "@/renderer/shared/dashboard";

import { generateParagraph } from '@/shared/utilities/noise';

const DashboardPanel = ({ children, ...props }: GridProps) => {
  return <Grid {...props} sx={{ textAlign: 'center' }}>
    <Slab>
      {children}
    </Slab>
  </Grid>
};

const seeder = () => Math.random();
const paragraphs = Array.from({ length: 3 }, () => generateParagraph({ seeder }));

export const HomeRoot = () => {
  const { entries } = useDiaryPanels();
  console.log('home diary entries data', entries)

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
    <Slab>
      {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </Slab>
    <EmailSyncPanel />
    <Diary />
  </div>
};
