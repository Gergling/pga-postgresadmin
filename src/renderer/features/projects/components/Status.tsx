import { Grid, Stack } from "@mui/material";
import { Typography } from "@/renderer/shared/theme";
import { ProjectEnvelope } from "@/shared/features/projects";
import {
  HorizontalLine
} from "@/renderer/shared/common";
import { useMemo } from "react";

const InfoChip = (props: {
  label: React.ReactNode;
  value: React.ReactNode;
}) => <Stack style={{ flexBasis: 0, flexGrow: 1 }}>
    <Typography variant="h6">{props.label}</Typography>
    <HorizontalLine />
    <Typography variant="body1">{props.value}</Typography>
  </Stack>

export const ProjectStatus = ({ project }: { project: ProjectEnvelope }) => {
  const status = useMemo(() => project.displayStatus, [project.displayStatus]);
  return <>
    <Grid container spacing={2}>
      <InfoChip label="Local" value={status.local} />
      <InfoChip label="Git" value={status.git} />
      <InfoChip label="Unit Tests Installed" value="Not Implemented" />
    </Grid>
    <Grid container spacing={2}>
      <InfoChip label="Last Checked" value={status.gitLastCheck} />
      <InfoChip label="Latest Commit Date" value={status.gitLatestCommitDate} />
    </Grid>
  </>;
};