import { SerialisedOperationSummary } from "@/shared/features/llm";
import { Card, CardContent, CardHeader } from "@/renderer/shared/card";
import { Grid } from "@mui/material";
import { AiOperationModel } from "./OperationModel";

export const AiOperation = ({
  experimental, name, stable
}: SerialisedOperationSummary) => {
  return <Card>
    <CardHeader sx={{ textAlign: 'center' }} title={name} />
    <CardContent>
      <Grid container spacing={4}>
        <Grid size={6}><AiOperationModel model={stable} /></Grid>
        <Grid size={6}><AiOperationModel experimental model={experimental} /></Grid>
      </Grid>
    </CardContent>
  </Card>
};
