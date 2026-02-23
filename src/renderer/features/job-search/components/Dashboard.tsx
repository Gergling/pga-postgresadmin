import { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, GridProps, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { HourglassTop } from "@mui/icons-material";
import { hydrateJobSearchApplication } from "../../../../shared/features/job-search";
import { Accordion } from "../../../shared/accordion";
import { Parenthesis } from "../../../shared/brackets";
import { JobSearchSelectPerson } from "./SelectPerson";
import { PersonOptionType } from "../../crm";
import { useJobSearchApplicationsIpc } from "../hooks";
import { interactionStore, jobSearchDashboardLayoutStore } from "../stores";
import { InteractionCreation } from "./InteractionCreation";
import { JobSearchInteractionList } from "./InteractionList";

type ColumnPosition =
  | 'left'
  // | 'center'
  | 'right';

const columnPositionSize: Record<ColumnPosition, number> = {
  left: 6,
  // center: 2,
  right: 6,
};

const columnPositionSizeInteractionEditor: Record<ColumnPosition, number> = {
  left: 12,
  // center: 2,
  right: 0,
};

const Column = ({
  children,
  columnPosition,
  ...props
}: GridProps & { columnPosition: ColumnPosition; }) => {
  const size = useMemo(() => columnPositionSize[columnPosition], [columnPosition]);
  return <Grid size={size} {...props}>
    <Parenthesis roundness={8} />
    <div style={{ padding: 20 }}>
      {children}
    </div>
  </Grid>;
};

export const JobSearchDashboard = () => {
  const {
    interactionCreator,
    toggleInteractionCreator,
    interactionEditor,
    closeInteractionEditor,
    openInteractionEditor,
  } = jobSearchDashboardLayoutStore();

  const columns = useMemo(
    () => interactionEditor
      ? columnPositionSizeInteractionEditor
      : columnPositionSize,
    [interactionEditor]
  );

  return <>
    Job Search Workflows
    <List sx={{ color: 'white' }}>
      <ListItem>
        <ListItemIcon><HourglassTop /></ListItemIcon>
        <ListItemText>A new lead arrives. This results in a new job application set to one of the "sourced" statuses. .</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><HourglassTop /></ListItemIcon>
        <ListItemText>An existing application has an update. It might not result in a status change for the application.</ListItemText>
      </ListItem>
    </List>
    {/* <Accordion expanded={showInteractionCreation} onChange={() => setShowInteractionCreation(!showInteractionCreation)}> */}
    <Accordion expanded={interactionCreator} onChange={toggleInteractionCreator} summary="Log Interaction"><InteractionCreation /></Accordion>
    CSS animation for opening:
    1. List fades out, right column fades out.
    2. Width increases, creation form shuts.
    3. Detail view fades in.
    <Grid container spacing={2} sx={{ color: 'white' }}>
      <Column columnPosition={'left'} size={columns.left}>
        <JobSearchInteractionList edit={openInteractionEditor} />
      </Column>
      {/* <Column columnPosition={'center'}>
        Active Applications in order of priority.
      </Column> */}
      <Column columnPosition={'right'} size={columns.right}>
        <ul>
          <li>Active Applications in order of priority.</li>
          <li>Most recently featured companies (provide company ratings)</li>
          <li>Most recently featured people (provide people ratings)</li>
        </ul>
      </Column>
      {/* <Column columnPosition={'right'}>
        <InteractionCreation />
      </Column> */}
    </Grid>
  </>;
};
