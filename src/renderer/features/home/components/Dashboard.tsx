import { Grid, GridProps } from "@mui/material";
import { generateParagraph } from '@/shared/utilities/noise';
import { Slab } from "@/renderer/shared/base";
import {
  DashboardPanel,
} from "@/renderer/shared/dashboard";
import { Diary } from "../../diary";
import { useHomePanels } from "../hooks";

const Panel = ({ children, ...props }: GridProps) => {
  return <Grid {...props} sx={{ textAlign: 'center' }}>
    <Slab>
      {children}
    </Slab>
  </Grid>
};

const seeder = () => Math.random();
const paragraphs = Array.from({ length: 3 }, () => generateParagraph({
  accent: 'scotlon', seeder, weight: { sentenceLength: 4 }
}));

const str = 'What am I doing with my life?';

export const HomeDashboard = () => {
  const { top: topPanels } = useHomePanels();

  return <div>
    <Grid container>
      {topPanels.map(
        (panel, index) => <Panel key={index} size={{ xs: 12, md: 4 }}>
          <DashboardPanel {...panel} />
        </Panel>
      )}
    </Grid>
    {/* <AiOperationsList /> */}
    {/* <Slab>
      <p>{str}</p>
      <Alien str={str} />
    </Slab>
    <Slab>
      {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </Slab> */}
    {/* <EmailSyncPanel /> */}
    <Diary />
  </div>
};
