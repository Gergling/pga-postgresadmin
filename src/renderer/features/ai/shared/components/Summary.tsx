import { useMemo } from "react";
import { Grid, Stack } from "@mui/material";
import { Slab } from "@/renderer/shared/base";
import { LlmHistoryRelative } from "@/shared/features/llm";
import { AiChip } from "./Chip";
import { ParentheticalContainer } from "@/renderer/shared/brackets";
import { OperationModelClassification } from "./OperationModelClassification";
import { Typography } from "@/renderer/shared/theme";
import { GridCellRenderer } from "@/renderer/shared/grid";

// const AiSummarySuccessful = ({}, LlmHistoryRelative) => 

const Row = ({ cells }: {
  cells: {
    label: React.ReactNode; value: React.ReactNode;
  }[]
}) => <Grid container alignItems={'center'}>
    {cells.map((props) => <Grid size={12 / cells.length}>
      <AiChip {...props} variant="body1" />
    </Grid>)}
  </Grid>;

export const AiSummaryCellRenderer: GridCellRenderer<LlmHistoryRelative> = ({
  row: {
    aggregation, classification, model, operation, relative, source, success
  }
}) => {
  return <Slab>
    <Stack gap={1}>
      <Row cells={[
        { label: 'Source', value: source },
        { label: 'Model', value: model },
        { label: 'Operation', value: operation },
      ]} />
      <ParentheticalContainer
        roundness={0}
        style={{ padding: '1rem' }}
      >
        <Grid container spacing={2} alignItems='center' textAlign={'center'}>
          <Grid size={6}>
            <Typography variant="body1">Classification</Typography>
          </Grid>
          <Grid size={6}>
            <OperationModelClassification classification={classification} />
          </Grid>
        </Grid>
      </ParentheticalContainer>
      <Row cells={[
        { label: 'Successful', value: aggregation.successful },
        { label: 'Terminal', value: aggregation.terminal },
        { label: 'Total', value: aggregation.total },
      ]} />
      <Row cells={[
        { label: 'Rate', value: success.rate },
        { label: 'Infrastucture', value: success.efficiency.infrastucture },
        { label: 'UX', value: success.efficiency.ux },
      ].map((props) => ({
        ...props, value: `${(props.value * 100).toFixed(1)}%`
      }))} />
      <Row cells={[
        { label: 'Min', value: success.runtimes.min },
        { label: 'Mean', value: success.runtimes.mean },
        { label: 'Median', value: success.runtimes.median },
        { label: 'Max', value: success.runtimes.max },
      ].map((props) => ({ ...props, value: `${(props.value / 1000).toFixed(1)}s` }))} />
      <Row cells={[
        { label: 'Divergence', value: relative.divergence },
        { label: 'Experience', value: relative.experience },
      ]} />
    </Stack>
  </Slab>;
};
