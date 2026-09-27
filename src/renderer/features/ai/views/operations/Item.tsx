import { Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  LlmOperation
} from "@/shared/features/llm";
import { Accordion } from "@/renderer/shared/accordion";
import { Card, CardContent, CardHeader } from "@/renderer/shared/card";
import { DataGrid } from "@/renderer/shared/grid";
import { AiModelData } from "../../shared";
import { useLlmOperationModelSummaryGrid } from "./hooks";

export const AiOperation = (data: LlmOperation) => {
  const { operation, models } = data;
  const {
    dataGridProps, isExperimental,
    models: { experimental, stable },
    setIsExperimental
  } = useLlmOperationModelSummaryGrid(data);

  return <Card>
    <CardHeader sx={{ textAlign: 'center' }} title={operation} />
    <CardContent>
      <Grid container spacing={4}>
        <Grid size={6}>
          <AiModelData reliability={'stable'} model={stable[0]} />
        </Grid>
        <Grid size={6}>
          <AiModelData reliability={'experimental'} model={experimental[0]} />
        </Grid>
      </Grid>
      <Accordion
        defaultExpanded={true}
        summary={'Other Models'}
      >
        <ToggleButtonGroup
          exclusive
          size="large"
          value={isExperimental ? 'experimental' : 'stable'}
          onChange={(_, newStability) => setIsExperimental(
            newStability === 'experimental'
          )}
        >
          <ToggleButton value="stable">
            Stable
          </ToggleButton>
          <ToggleButton value="experimental">
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
