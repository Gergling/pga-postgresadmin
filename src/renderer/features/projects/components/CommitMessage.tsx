import { Grid, Stack } from "@mui/material";
import { RitualTelemetrySubscriptionParams } from "@/shared/features/ai";
import { CommitMessage } from "@/shared/features/projects";
import { Slab } from "@/renderer/shared/base";
import { ParentheticalContainer } from "@/renderer/shared/brackets";

export const ProjectFormattedCommitMessage = ({
  body, scope, summary, type,
}: CommitMessage) => {
  return <Slab showScanLines style={{ margin: '1rem 0' }}>
    <ParentheticalContainer roundness={0} style={{ padding: '1rem' }}>
      <Stack spacing={1}>
        <Grid container spacing={1}>
          <strong>{type}{scope && `(${scope})`}: </strong>
          <span>{summary}</span>
        </Grid>
        <div>{body}</div>
      </Stack>
    </ParentheticalContainer>
  </Slab>;
};

// export const ProjectCommitStdOut = ({ stdout }: { stdout: string; }) => <>
//   Commit generated this std output: <strong>{stdout}</strong>
// </>;
// export const ProjectCommitStdErr = ({ stderr, stdout }: {
//   stderr: string; stdout: string;
// }) => <>
//   An error occurred while committing: <strong>{stderr}</strong>
//   <strong>{stdout}</strong>
// </>;

export const ProjectCommitRitualTelemetryChatMessage = (
  {
    // message,
    phase,
    // project,
    retried,
    status,
  }: RitualTelemetrySubscriptionParams
) => {
  return <Grid spacing={1} container>
    Commit message generation progress:
    [<strong>{phase}</strong>]: {status}
    {retried && `${retried} retries.`}
  </Grid>;
};
