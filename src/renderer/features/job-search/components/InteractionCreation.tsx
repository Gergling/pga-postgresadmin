import { 
  Box, 
  TextField, 
  Stack,
  Grid,
} from '@mui/material';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { Autocomplete } from "../../../shared/autocomplete";
import { useJobSearchInteraction } from "../hooks";
import { JobSearchSelectPerson } from "./SelectPerson";
import { 
  FormContainer, 
  SectionLabel, 
  SubmitButton 
} from './InteractionCreation.style';
import { JobSearchInteractionSource } from './InteractionSource';

export const InteractionCreation = () => {
  const {
    applicationAutocomplete,
    selectedPerson,
    setPerson,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    notes,
    handleNotesChange,
    sourceProps,
    
    enableSubmission,
    handleSubmit,
    validity,
  } = useJobSearchInteraction();

  return (
    <FormContainer elevation={0}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <SectionLabel>Person</SectionLabel>
              <JobSearchSelectPerson
                person={selectedPerson}
                setPerson={setPerson}
              />
            </Grid>
            <Grid size={6}>
              <SectionLabel>Role</SectionLabel>
              <Autocomplete {...applicationAutocomplete} />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={6}>
              <SectionLabel>Time</SectionLabel>
              <DateTimePicker
                value={startTime}
                onChange={setStartTime}
              />
              <TimePicker
                value={endTime}
                onChange={setEndTime}
              />
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
            {validity.values().map(({ level, message }) => <>{level}</>)}
          </Box>
          Could have a validation "progress bar" in which segments are slanted-separated neon outlines.
          Maybe they contain runes, maybe not. Who TF knows.

          <SubmitButton type="submit" fullWidth disabled={!enableSubmission}>
            LOG INTERACTION
          </SubmitButton>
        </Stack>
      </form>
    </FormContainer>
  );
};
