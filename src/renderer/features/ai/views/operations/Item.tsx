import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { SerialisedOperationSummary } from "@/shared/features/llm";
import { Accordion } from "@/renderer/shared/accordion";
import { Card, CardContent, CardHeader } from "@/renderer/shared/card";
import { DataGrid } from "@/renderer/shared/grid";
import { AiOperationModel, useLlmOperationModelSummaryGrid } from "../models";

export const AiOperation = ({
  experimental, name, stable
}: SerialisedOperationSummary) => {
  const {
    dataGridProps, modelsIsLoading, isExperimental, setIsExperimental
  } = useLlmOperationModelSummaryGrid(name);
  console.log(name, experimental, stable)

  return <Card>
    <CardHeader sx={{ textAlign: 'center' }} title={name} />
    <CardContent>
      <Grid container spacing={4}>
        <Grid size={6}><AiOperationModel model={stable} /></Grid>
        <Grid size={6}>
          <AiOperationModel experimental model={experimental} />
        </Grid>
      </Grid>
      <Accordion
        defaultExpanded={true}
        summary={'Other Models'}
        disabled={modelsIsLoading}
      >
        <ToggleButtonGroup
          exclusive
          size="large"
          value={isExperimental ? 'experimental' : 'stable'}
          onChange={(_, newStability) => setIsExperimental(newStability === 'experimental')}
        >
          <ToggleButton value="stable" key="left">
            Stable
          </ToggleButton>
          <ToggleButton value="experimental" key="left">
            Experimental
          </ToggleButton>
        </ToggleButtonGroup>
        <Grid container>
          <Grid size={6}></Grid>
        </Grid>
        <DataGrid {...dataGridProps} />
      </Accordion>
    </CardContent>
  </Card>
};
