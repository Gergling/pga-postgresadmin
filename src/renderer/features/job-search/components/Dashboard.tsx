import { useCallback, useEffect, useMemo } from "react";
import { Grid, GridProps, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { HourglassTop } from "@mui/icons-material";
import { hydrateJobSearchApplication } from "../../../../shared/features/job-search";
import { Parenthesis } from "../../../shared/brackets";
import { JobSearchSelectPerson } from "./SelectPerson";
import { PersonOptionType } from "../../crm";
import { useJobSearchApplicationsIpc } from "../hooks";
import { interactionStore } from "../stores";
import { InteractionCreation } from "./InteractionCreation";

type ColumnPosition = 'left' | 'center' | 'right';

const columnPositionSize: Record<ColumnPosition, number> = {
  left: 2,
  center: 2,
  right: 8,
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
    interaction: {
      application,
      person,
    },
    setPerson,
  } = interactionStore();
  const {
    createApplication,
  } = useJobSearchApplicationsIpc();

  const createNewApplication = useCallback(() => {
    console.log('application', application)
    if (!application) return;
    createApplication(hydrateJobSearchApplication(application));
  }, [application, createApplication]);

  const selectedPerson = useMemo((): PersonOptionType | null => {
    if (!person) return null;
    return { title: person.name };
  }, [person]);

  useEffect(() => {
    console.log('create new application', application)
    createNewApplication();
  }, [createNewApplication]);

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
    <Grid container spacing={2} sx={{ color: 'white' }}>
      <Column columnPosition={'left'}>
        Interactions in order of descending recency
      </Column>
      <Column columnPosition={'center'}>
        Active Applications in order of priority.
      </Column>
      <Column columnPosition={'right'}>
        <ul>
          <li>Person</li>
          <li>Application</li>
          <li>Time (and Date)</li>
        </ul>
        <InteractionCreation />

        <JobSearchSelectPerson
          person={selectedPerson}
          setPerson={setPerson}
        />
      </Column>
    </Grid>
  </>;
};
