import { Grid, Stack, TypographyProps } from "@mui/material";
import { Slab, StackChip, StackChipProps } from "@/renderer/shared/base";
import { ParentheticalContainer } from "@/renderer/shared/brackets";
import { Typography } from "@/renderer/shared/theme";
import { SerialisedModelSummary } from "@/shared/features/llm";
import { OperationModelClassification } from "../../shared";
import { useMemo } from "react";

const Chip = ({
  label, value, variant, ...props
}: StackChipProps & Pick<TypographyProps, 'variant'>) => <StackChip
    label={<Typography variant={variant ?? 'body2'}>{label}</Typography>}
    value={value}
    alignItems={'center'}
    {...props}
  />

export type AiOperationModelProps = {
  experimental?: boolean;
  model: SerialisedModelSummary;
};
export const AiOperationModel = ({ experimental, model }: AiOperationModelProps) => {
  const label = experimental ? "Experimental model" : "Stable model";

  const { hasNonRetryableRuns, hasSuccessfulRuns, rate } = useMemo(() => {
    const hasNonRetryableRuns = model.classification !== 'retryable';
    const hasSuccessfulRuns = [
      'stable', 'potential'
    ].includes(model.classification);
    const rate = Math.max(model.rate, 0);
    return {
      hasNonRetryableRuns, hasSuccessfulRuns, rate
    };
  }, [model]);
  return <Slab>
    <Stack gap={1}>
      <Chip label={label} value={model.name} variant="body1" />
      <Grid container alignItems={'center'}>
        <Grid size={4}>
          <Chip label="Source" value={model.source} />
        </Grid>
        {hasNonRetryableRuns
          ? <>
            <Grid size={4}>
              <Chip
                label="Success rate"
                value={`${(rate * 100).toFixed(1)}%`}
              />
            </Grid>
            <Grid size={4}>
              <Chip label="Total runs" value={model.count} />
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
      {hasSuccessfulRuns ? <Chip label="Successful runtimes" value={
        <Grid container alignSelf={'stretch'}>
          <Grid size={6}>
            <Chip label='Median' value={model.runtime.median} />
          </Grid>
          <Grid size={6}>
            <Chip label='Mean' value={model.runtime.mean} />
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
