import { useMemo } from "react";
import { Accordion } from "@/renderer/shared/accordion";
import { DataGrid, useDataGrid } from "@/renderer/shared/grid";
import { LlmSummary } from "@/shared/features/llm";
import { modelSummaryColumnGroups, modelSummaryColumns } from "../columns";

const isReactNode = (value: unknown): value is React.ReactNode => {
  // 1. Primitives that React safely renders (or skips)
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }

  // 2. Handle Arrays (must recursively check if every element is a ReactNode)
  if (Array.isArray(value)) {
    return value.every(isReactNode);
  }

  // 3. Handle Objects (React Elements/JSX)
  if (typeof value === 'object') {
    // React elements uniquely carry a '$$typeof' symbol property
    return '$$typeof' in value;
  }

  // Functions and Symbols are not valid ReactNodes
  return false;
}

export const AiModelSource = ({
  models, source
}: { models: LlmSummary[]; source: string; }) => {
  const summary = useMemo(
    () => `${source}: (${models.length} models)`, [models, source]
  );
  const dataGridProps = useDataGrid({
    autosizeOptions: { expand: true },
    columnGroupingModel: modelSummaryColumnGroups,
    columns: modelSummaryColumns,
    getRowHeight: () => 'auto',
    getRowId: ({ model, source }) => [source, model].join('-'),
    rows: models,
    rowSpanning: true,
  });

  return <Accordion
    defaultExpanded={true}
    summary={summary}
  >
    <DataGrid {...dataGridProps} />
  </Accordion>
};
