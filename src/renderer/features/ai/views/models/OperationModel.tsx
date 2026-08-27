import { Grid, Stack, TypographyProps } from "@mui/material";
import { Slab, StackChip, StackChipProps } from "@/renderer/shared/base";
import { ParentheticalContainer } from "@/renderer/shared/brackets";
import { COLORS, neonGlowStyle, Typography } from "@/renderer/shared/theme";
import { SerialisedModelSummary } from "@/shared/features/llm";
import { OperationModelClassification } from "../../shared";

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

  return <Slab>
    <Stack gap={1}>
      <Chip label={label} value={model.name} variant="body1" />
      <Grid container>
        <Grid size={4}>
          <Chip label="Source" value={model.source} />
        </Grid>
        <Grid size={4}>
          <Chip
            label="Success rate"
            value={`${(model.rate * 100).toFixed(1)}%`}
          />
        </Grid>
        <Grid size={4}>
          <Chip label="Total runs" value={model.count} />
        </Grid>
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
      <Chip label="Successful runtimes" value={
        model.runtime.mean && model.runtime.mean
          ? <Grid container alignSelf={'stretch'}>
            <Grid size={6}>
              <Chip label='Median' value={model.runtime.median} />
            </Grid>
            <Grid size={6}>
              <Chip label='Mean' value={model.runtime.mean} />
            </Grid>
          </Grid>
          : 'No successful runs'
      } />
    </Stack>
  </Slab>
    ;
}
