import { SerialisedModelSummary } from "@/shared/features/llm";
import { useMemo } from "react";
import { AiChip } from "./Chip";
import { Grid } from "@mui/material";
import { ParentheticalContainer } from "@/renderer/shared/brackets";

export const AiModelRuntimes = (model: SerialisedModelSummary) => {
  const { hasSuccessfulRuns } = useMemo(() => {
    const hasSuccessfulRuns = [
      'stable', 'potential'
    ].includes(model.classification);

    return {
      hasSuccessfulRuns
    };
  }, [model]);

  return hasSuccessfulRuns ? <AiChip label="Successful runtimes" value={
    <Grid container alignSelf={'stretch'}>
      <Grid size={6}>
        <AiChip label='Median' value={model.runtime.median} />
      </Grid>
      <Grid size={6}>
        <AiChip label='Mean' value={model.runtime.mean} />
      </Grid>
    </Grid>
  } /> : <ParentheticalContainer
    roundness={0}
    style={{ padding: '0.5rem 2rem', textAlign: 'center' }}
  >No successful runs</ParentheticalContainer>
};
