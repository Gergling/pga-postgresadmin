import React, { useMemo, useState } from 'react';
import { 
  Box, 
  TextField, 
  Stack,
} from '@mui/material';
import { Autocomplete } from "../../../shared/autocomplete";
import { PersonOptionType } from "../../crm";
import { useJobSearchApplicationSelector } from "../hooks";
import { interactionStore } from "../stores";
import { JobSearchSelectPerson } from "./SelectPerson";
import { 
  FormContainer, 
  SectionLabel, 
  SubmitButton 
} from './InteractionCreation.style';
import { DateTimePicker } from '@mui/x-date-pickers';

export const InteractionCreation = () => {
  const { application, autocomplete: applicationAutocomplete } = useJobSearchApplicationSelector();
  // const application = interactionStore(state => state.interaction.application);
  // const setApplication = interactionStore(state => state.setApplication);
  const person = interactionStore(state => state.interaction.person);
  const setPerson = interactionStore(state => state.setPerson);
  
  const selectedPerson = useMemo((): PersonOptionType | null => {
    if (!person) return null;
    return { title: person.name };
  }, [person]);
  
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));

  // Notes
  const [notes, setNotes] = useState<string>('');
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  // TODO: Source
  // Entry is hardcoded to manual for this form anyway.
  // Simple dropdown listing email/phone/other.
  // Emails and phone numbers should be broadly validated.
  // Other text should be a multiline.
  // An empty string goes in as undefined.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("COMMUNING WITH REGISTRY...");
    console.log({
      person,
      application,
      timestamp,
      loggedAt: new Date().toISOString()
    });
    // Trigger your "26 minutes ago" label here
  };

  return (
    <FormContainer elevation={0}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          
          {/* PERSON SELECTOR */}
          <Box>
            <SectionLabel>Person</SectionLabel>
            <JobSearchSelectPerson
              person={selectedPerson}
              setPerson={setPerson}
            />
          </Box>

          <Box>
            <SectionLabel>Role</SectionLabel>
            <Autocomplete {...applicationAutocomplete} />
          </Box>

          <Box>
            <SectionLabel>Time</SectionLabel>
            {/* <DateTimePicker
              label="Controlled picker"
              value={value}
              onChange={(newValue) => setValue(newValue)}
            /> */}
            {/* <TextField
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              variant="standard"
              fullWidth
              helperText="Determining causal alignment..."
            /> */}
          </Box>

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

          <SubmitButton type="submit" fullWidth>
            LOG INTERACTION
          </SubmitButton>
        </Stack>
      </form>
    </FormContainer>
  );
};
