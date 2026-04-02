import { 
  Box, 
  TextField, 
  Stack,
  Grid,
} from '@mui/material';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { JobSearchDbSchema } from '../../../../shared/features/job-search';
import { Autocomplete } from "../../../shared/autocomplete";
import { Button } from '../../../shared/form';
import { ProgressBar } from '../../../shared/progress-bar';
import {
  // useJobSearchInteraction,
  useJobSearchInteractionForm
} from "../hooks";
import { 
  FormContainer, 
  SectionLabel, 
  SubmitButton 
} from './InteractionDetail.style';
import { JobSearchInteractionSource } from './InteractionSource';

export const InteractionDetail = ({
  interactionId,
  suppressRoleField,
}: {
  interactionId?: JobSearchDbSchema['id']['interactions'];
  suppressRoleField?: boolean;
}) => {
  // const {
  //   // applicationAutocomplete,
  //   // selectedPerson,
  //   // setPerson,
  //   startTime,
  //   setStartTime,
  //   endTime,
  //   setEndTime,
  //   notes,
  //   handleNotesChange,
  //   sourceProps,
    
  //   interaction, // Will need to adjust type for interaction form management, possibly.

  //   // enableSubmission,
  //   // handleSubmit,
  //   // validity,
  // } = useJobSearchInteraction(interactionId);

  // useCrmPersonCreativeAutocomplete();


  // Form logic.
  // const {
  //   form,

  //   applicationAutocomplete,
  //   personAutocomplete,

  //   timeperiodStartField,

  //   validityProgress,
  // } = useJobSearchInteractionForm(interaction);

  // TODO: Validation needs to be moved over to form handling, which means the interaction hook may become irrelevant.

  // const person = form.fieldInfo['person'].instance; // This has my FormApi type... probably.

  return (
    <FormContainer elevation={0}>
      {/* <form.Field name="person">
        {(field) => (
          <PersonSelector 
            value={field.state.value}
            onChange={(val) => field.setValue(val)}
            error={field.state.meta.errors[0]?.toString()}
          />
        )}
      </form.Field> */}
      {/* <form onSubmit={form.handleSubmit}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <SectionLabel>Person</SectionLabel>
              <Autocomplete {...personAutocomplete} />
            </Grid>
            {!suppressRoleField && <Grid size={6}>
              <SectionLabel>Role</SectionLabel>
              <Autocomplete {...applicationAutocomplete} />
            </Grid>}
          </Grid>

          <Grid container spacing={2}>
            <Grid size={6}>
              <SectionLabel>Time</SectionLabel>
              <DateTimePicker
                value={timeperiodStartField.state.value}
                onChange={(start) => timeperiodStartField.setValue(start)}
              />
              <form.Field name="timeperiod.end">
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
              <JobSearchInteractionSource {...sourceProps}  />
            </Grid>
          </Grid>

          <Box>
            <SectionLabel>Notes</SectionLabel>
            <TextField
              value={notes}
              onChange={handleNotesChange}
              variant="standard"
              fullWidth
              multiline
            />
          </Box>

          <Box>
            <ProgressBar {...validityProgress} />
          </Box>

          <Button type="submit" fullWidth>
            LOG INTERACTION
          </Button>
        </Stack>
      </form> */}
    </FormContainer>
  );
};
