import { Grid, GridProps } from "@mui/material";
import { Diary, useDiaryPanels } from "../../diary";
import { EmailSyncPanel } from "../../email/components/EmailSyncPanel";
import { Slab } from "@/renderer/shared/base";
import { DashboardStackChip, PanelDataItem } from "@/renderer/shared/dashboard";

import { generateParagraph } from '@/shared/utilities/noise';
import { useMemo } from "react";
import { DashboardSparkline } from "@/renderer/shared/dashboard/components/Sparkline";

const DashboardPanel = ({ children, ...props }: GridProps) => {
  return <Grid {...props} sx={{ textAlign: 'center' }}>
    <Slab>
      {children}
    </Slab>
  </Grid>
};

const seeder = () => Math.random();
const paragraphs = Array.from({ length: 3 }, () => generateParagraph({ seeder }));

const PanelContent = (props: PanelDataItem) => {
  switch(props.display) {
    case 'chip': return <DashboardStackChip {...props} />;
    case 'sparkline': return <DashboardSparkline {...props} values={props.value} />;
  }
}

export const HomeRoot = () => {
  const diaryPanels = useDiaryPanels();
  const panels = useMemo(() => diaryPanels.sort(
    (panelA, panelB) => panelB.weights.achievement - panelA.weights.achievement
  ), [diaryPanels]);
  const topPanels = panels.slice(0, 3);

  return <div>
    <Grid container>
      {topPanels.map(
        (panel, index) => <DashboardPanel key={index} size={{ xs: 12, md: 4 }}>
          <PanelContent {...panel} />
        </DashboardPanel>
      )}
    </Grid>
    <Slab>
      {/* {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)} */}
    </Slab>
    <EmailSyncPanel />
    <Diary />
  </div>
};
