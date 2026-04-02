import { PropsWithChildren, useMemo, useReducer } from "react";
import { Check, Edit, HourglassTop } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  FormControlLabel,
  Grid,
  GridProps,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography
} from "@mui/material";
import { JobSearchApplicationTransfer, JobSearchDbSchema, JobSearchInteractionPersistent } from "../../../../shared/features/job-search";
import { Button, Fieldset, FormFieldLabel, FormTitle, SafetyControl, TextField } from "../../../shared/form";
import { ParentheticalHeading } from "../../../shared/brackets";
// import { Optional } from "../../../../shared/types";
import { useJobSearchUpdateForm, useJobSearchApplicationsIpc, useJobSearchInteractionForm, useJobSearchInteractionsIpc, useJobSearchIpcUpdate } from "../hooks";
import { JobSearchUpdateSalary } from "./UpdateSalary";
import { JobSearchUpdateStage } from "./UpdateStage";
import { CrmCompanyCreativeAutocomplete, CrmPersonCreativeAutocomplete } from "../../crm";
import { InteractionDetail } from "./InteractionDetail";
import { JobSearchInteractionList } from "./InteractionList";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { SectionLabel } from "./InteractionDetail.style";
import { JobSearchInteractionSource } from "./InteractionSource";

// Cases:
// 1. Role Update: 
// 2. New Role: 
// 3. Correction (Interaction Edit or Role Edit without an interaction)

const Field = ({ children, label, ...props }: PropsWithChildren & GridProps & { label: React.ReactNode }) => {
  return <Grid {...props}>
    <FormFieldLabel>{label}</FormFieldLabel>
    {children}
  </Grid>;
};

export const JobSearchUpdate = ({
  applicationId,
  interactionId,
}: {
  applicationId?: JobSearchDbSchema['id']['applications'];
  interactionId?: JobSearchDbSchema['id']['interactions'];
}) => {
  // IPC
  const {
    application: existingApplication,
  } = useJobSearchApplicationsIpc(applicationId);

  // const {
  //   interaction: existingInteraction,
  // } = useJobSearchInteractionsIpc(interactionId);

  // Form
  const {
    form, company, agency, phase, stages, fieldVisibility,
    interactionPerson, 
  } = useJobSearchUpdateForm(existingApplication);

  const isPersisted = useMemo(() => !!applicationId, [applicationId]);

  const title = useMemo((): string => {
    if (interactionId) return 'Review this interaction and correct where necessary.';
    if (applicationId) return 'Update this role and log the interaction.';
    return 'Create a new role and detail the interaction which prompted it.';
  }, [existingApplication, interactionId])

  return <>
    {existingApplication?.pending && <div style={{ backgroundColor: '#600', padding: '0.25rem', textAlign: 'center', color: 'white', marginBottom: '1rem' }}>
      Application is on hold.
    </div>}
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTitle>{title}</FormTitle>
        </Grid>
        <Fieldset legend='Application Details'>
          <Grid container spacing={2}>
            <Field size={{ xs: 12, sm: 6, md: fieldVisibility.get('agency') ? 4 : undefined }} label="Role Title">
              <form.Field name="application.role">
                {(field) => (
                  <SafetyControl
                    control={<TextField
                      onPersist={field.setValue}
                      required
                      value={field.state.value}
                    />}
                    display={field.state.value}
                    doneIcon={<Check />}
                    editable={!isPersisted}
                    editIcon={<Edit />}
                  />
                )}
              </form.Field>
            </Field>
            <Grid size={{ xs: 12, sm: 6, md: fieldVisibility.get('agency') ? 4 : undefined }}>
              <FormFieldLabel>Company</FormFieldLabel>
              <SafetyControl
                control={<CrmCompanyCreativeAutocomplete
                  state={company.state}
                  setValue={company.setValue}
                />}
                display={`@ ${company.state.value?.name || '(Company name not provided)'}`}
                doneIcon={<Check />}
                editable={!isPersisted}
                editIcon={<Edit />}
              />
            </Grid>
            {fieldVisibility.get('agency') && <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormFieldLabel>Agency</FormFieldLabel>
              <SafetyControl
                control={<CrmCompanyCreativeAutocomplete
                  state={agency.state}
                  setValue={agency.setValue}
                />}
                display={agency.state.value ? `via ${agency.state.value.name}` : ''}
                doneIcon={<Check />}
                editable={!isPersisted}
                editIcon={<Edit />}
              />
            </Grid>}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormFieldLabel>Salary</FormFieldLabel>
              <form.Field name="application.salary">
                {(field) => (
                  <JobSearchUpdateSalary initialEditMode={!applicationId} value={field.state.value} setValue={field.setValue} />
                )}
              </form.Field>
            </Grid>
            {fieldVisibility.get('pending') && <Grid size={{ xs: 12, sm: 2 }}>
              <FormFieldLabel>On Hold</FormFieldLabel>
              <form.Field name="application.pending">
                {(field) => (
                  <FormControlLabel
                    control={<Switch onChange={({ target: { checked } }) => field.setValue(checked)} value={field.state.value} />}
                    label="On hold"
                  />
                )}
              </form.Field>
            </Grid>}
            <Grid size={{ xs: 7, sm: 5, md: 3 }}>
              <FormFieldLabel>Source</FormFieldLabel>
              <Grid>
                <form.Field name="application.isListingSourceType">
                  {(field) => (
                    <SafetyControl
                      control={<>
                        Agent
                        <Switch
                          onChange={({
                            target: { checked }
                          }) => field.setValue(checked)}
                          checked={field.state.value}
                        />
                        Listing
                      </>}
                      display={field.state.value ? 'Listing' : 'Agent'}
                      doneIcon={<Check />}
                      editable={!isPersisted}
                      editIcon={<Edit />} />
                  )}
                </form.Field>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12 }} justifyContent={'center'} container>
              <ParentheticalHeading heading="hidden fields">
                <Breadcrumbs separator="|" sx={{  }}>
                  {fieldVisibility.off.map((key) => <Link
                    onClick={() => fieldVisibility.set(key)}
                    style={{ textTransform: 'uppercase' }}>{key}</Link>
                  )}
                </Breadcrumbs>
              </ParentheticalHeading>
            </Grid>
            {isPersisted && <Grid size={{ xs: 12 }}>
              <JobSearchUpdateStage
                phase={phase.state.value as JobSearchApplicationTransfer['phase']}
                stages={stages.state.value}
                setPhase={phase.setValue}
                setStages={stages.setValue}
              />
            </Grid>}
          </Grid>
        </Fieldset>
        <Fieldset legend='Interaction Details'>
          <Grid container spacing={2}>
            <Grid size={6}>
              <FormFieldLabel>Person</FormFieldLabel>
              <CrmPersonCreativeAutocomplete
                state={interactionPerson.state}
                setValue={interactionPerson.setValue}
              />
            </Grid>

            <Grid size={6}>
              <FormFieldLabel>Time</FormFieldLabel>

              {/* <SectionLabel>Time</SectionLabel>
              <DateTimePicker
                value={timeperiodStartField.state.value}
                onChange={(start) => timeperiodStartField.setValue(start)}
              /> */}
              <form.Field name="interaction.timeperiod.start">
                {(field) => (
                  <DateTimePicker
                    value={field.state.value}
                    onChange={(start) => field.setValue(start)}
                  />
                )}
              </form.Field>
              <form.Field name="interaction.timeperiod.end">
                {(field) => (
                  <TimePicker
                    value={field.state.value}
                    onChange={(end) => field.setValue(end)}
                  />
                )}
              </form.Field>
            </Grid>
            <Grid size={6}>
              <SectionLabel>Source</SectionLabel>
              <form.Field name="interaction.source">
                {(field) => (
                  <JobSearchInteractionSource
                    setValue={field.setValue}
                    state={field.state}
                  />
                )}
              </form.Field>
            </Grid>
          </Grid>

          <Box>
            <SectionLabel>Notes</SectionLabel>
            <form.Field name="interaction.notes">
              {(field) => (
                <SafetyControl
                  control={<TextField
                    multiline
                    onPersist={field.setValue}
                    required
                    value={field.state.value}
                  />}
                  display={field.state.value}
                  doneIcon={<Check />}
                  editable={!isPersisted}
                  editIcon={<Edit />}
                />
              )}
            </form.Field>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              Interaction section: This is where it needs to be clearly conveyed that *person* interacted regarding the role.
              We need a dumber interaction form. Ideally we submit everything at once.
              <InteractionDetail interactionId={interactionId} suppressRoleField />
              Reminder that interaction list will need some thought. For example, when you click on an interaction, should you be able to edit it, even though you've come here to make an update against the role?
              {isPersisted && <JobSearchInteractionList applicationId={applicationId} edit={console.log} />}
            </Grid>
          </Grid>

          <Button fullWidth onClick={() => form.handleSubmit()}>
            LOG UPDATE
          </Button>
        </Fieldset>
      </Grid>
    </Box>
    <List>
      <ListItem>
        <ListItemIcon><HourglassTop /></ListItemIcon>
        <ListItemText>Hidden fields displayed as Salary Range | Expected Update Time | Etc. Clicking them makes them visible and editable.</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><HourglassTop /></ListItemIcon>
        <ListItemText>Vitals: These fields are conditionally visible</ListItemText>
        <List>
          <ListItem>
            <ListItemIcon><HourglassTop /></ListItemIcon>
            <ListItemText>Expected update: Show if populated. This is a date/time so presets should be at the daily level, possibly days in advance and probably not including weekends.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><HourglassTop /></ListItemIcon>
            <ListItemText>Offer: This is such a rare occurrence that the absolute minimum effort can be applied.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><HourglassTop /></ListItemIcon>
            <ListItemText>Stages Panel: This is a list of items each with a phase, status, technical level, completion flag and time occurrence, which can either be a specific time, or unscheduled.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><HourglassTop /></ListItemIcon>
            <ListItemText>Agency and/or Company: These are separate fields, but both will have the same logic.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><HourglassTop /></ListItemIcon>
            <ListItemText>Agent(s): This is computed from the contacts list and agency.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><HourglassTop /></ListItemIcon>
            <ListItemText>Contacts list: This is a list of everyone involved who isn't the hiring manager or an agent. Includes any unique contacts and anyone who interviewed.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><HourglassTop /></ListItemIcon>
            <ListItemText>Interactions Panel: A simple list of interactions regarding the role in chronological order.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><HourglassTop /></ListItemIcon>
            <ListItemText>Notes: Just a text field.</ListItemText>
          </ListItem>
        </List>
      </ListItem>
    </List>
  </>;
};
