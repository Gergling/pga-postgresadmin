import { Grid, Stack, TypographyProps } from "@mui/material";
import { Slab, StackChip, StackChipProps } from "@/renderer/shared/base";
import { ParentheticalContainer } from "@/renderer/shared/brackets";
import { Typography } from "@/renderer/shared/theme";
import { LlmHistoryRelative, SerialisedModelSummary } from "@/shared/features/llm";
import { useMemo } from "react";
import { OperationModelClassification } from "./OperationModelClassification";
import { AiChip } from "./Chip";

type Reliability = 'experimental' | 'stable';

const reliabilityLabel = (value?: Reliability) => {
  if (value === 'experimental') return 'Experimental model';
  if (value === 'stable') return 'Stable model';
  return 'Model';
}

export type AiOperationModelProps = {
  reliability?: Reliability;
  model: LlmHistoryRelative;
};
export const AiModelData = ({
  model, reliability,
}: AiOperationModelProps) => {
  const label = reliabilityLabel(reliability);

  const { hasNonRetryableRuns, hasSuccessfulRuns, rate, runs } = useMemo(() => {
    const hasNonRetryableRuns = model.classification !== 'retryable';
    const hasSuccessfulRuns = [
      'stable', 'potential'
    ].includes(model.classification);
    const rate = Math.max(model.success.rate, 0);
    const runs = [
      model.runs.runtimes.length, model.runs.retryable, model.runs.failures
    ].join(' / ');
    return {
      hasNonRetryableRuns, hasSuccessfulRuns, rate, runs
    };
  }, [model]);
  return <Slab>
    <Stack gap={1}>
      <AiChip label={label} value={model.model} variant="body1" />
      <Grid container alignItems={'center'}>
        <Grid size={4}>
          <AiChip label="Source" value={model.source} />
        </Grid>
        {hasNonRetryableRuns
          ? <>
            <Grid size={4}>
              <AiChip
                label="Success rate"
                value={`${(rate * 100).toFixed(1)}%`}
              />
            </Grid>
            <Grid size={4}>
              <AiChip label="Total runs" value={runs} />
            </Grid>
          </>
          : <Grid size={8}>
            <ParentheticalContainer
              roundness={0}
              style={{ padding: '0.5rem 2rem', textAlign: 'center' }}
            >Only has retryable runs</ParentheticalContainer>
          </Grid>
        }
      </Grid>
      <ParentheticalContainer
        roundness={0}
        style={{ padding: '1rem' }}
      >
        <Grid container spacing={2} alignItems='center' textAlign={'center'}>
          <Grid size={6}>
            <Typography variant="body1">Classification</Typography>
          </Grid>
          <Grid size={6}>
            <OperationModelClassification
              classification={model.classification}
            />
          </Grid>
        </Grid>
      </ParentheticalContainer>
      {hasSuccessfulRuns ? <AiChip label="Successful runtimes" value={
        <Grid container alignSelf={'stretch'}>
          <Grid size={6}>
            <AiChip label='Median' value={model.success.runtimes.median} />
          </Grid>
          <Grid size={6}>
            <AiChip label='Mean' value={model.success.runtimes.mean} />
          </Grid>
        </Grid>
      } /> : <ParentheticalContainer
        roundness={0}
        style={{ padding: '0.5rem 2rem', textAlign: 'center' }}
      >No successful runs</ParentheticalContainer>}
    </Stack>
  </Slab>
    ;
}
