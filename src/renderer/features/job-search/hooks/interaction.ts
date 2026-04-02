import { useEffect, useMemo, useState } from "react";
// import { interactionStore } from "../stores";
import { CrmPersonOptionType } from "../../crm";
import { useJobSearchInteractionSource } from "./interaction-source-selector";
import { useJobSearchApplicationsIpc } from "./application-ipc";
import { useJobSearchInteractionsIpc } from "./interaction-ipc";
import { hydrateJobSearchInteraction, JobSearchDbSchema } from "../../../../shared/features/job-search";
import { JobSearchUpsertableApplication } from "../types";


type Interaction = JobSearchDbSchema['base']['interactions'];
type NewInteraction = Omit<Interaction, 'id'>;

type ValidityLevel = 'valid' | 'warn' | 'fail';
type ValidityBody = {
  level: ValidityLevel;
  message?: string;
};
type Validity = Map<keyof Interaction, ValidityBody & {
  label: string;
}>;

const validityLabels: Partial<Record<keyof Interaction, string>> = {
  application: 'Role',
  person: 'Person',
  timeperiod: 'Time of interaction',
};

export const useJobSearchInteraction = (interactionId?: JobSearchDbSchema['id']['interactions']) => {
  // IPC
  const {
    createInteraction,
    createInteractionError,
    createInteractionIsError,
    createInteractionIsPending,
    interactions
  } = useJobSearchInteractionsIpc();
  const existingInteraction = useMemo(
    () => interactionId ? interactions?.get(interactionId) : undefined,
    [interactionId, interactions]
  );

  // Application

  // Person
  // useCrmPersonCreativeAutocomplete(existingInteraction?.person);
  // const person = interactionStore(state => state.interaction.person);
  // const setPerson = interactionStore(state => state.setPerson);  
  // const selectedPerson = useMemo((): CrmPersonOptionType | null => {
  //   if (!person) return null;
  //   return { title: person.name };
  // }, [person]);

  // Timeperiod
  // TODO: Presets: E.g. beginning of this hour, beginning of previous hour, etc...
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Notes
  const [notes, setNotes] = useState<string>('');
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  // Source
  const sourceProps = useJobSearchInteractionSource();

  // Metadata
  // const validity = useMemo(() => {
  //   const application = applicationAutocomplete.value;
  //   const applicationValidity: ValidityBody = application && !application.id ? {
  //     level: 'fail',
  //     message: 'Loading application',
  //   } : { level: 'valid' };
  //   const personValidity: ValidityBody = person && !person.id ? {
  //     level: 'fail',
  //     message: 'Loading person',
  //   } : { level: 'valid' };
  //   const timeperiodValidity: ValidityBody = !startTime ? {
  //     level: 'fail',
  //     message: 'A start time is required',
  //   } : (!endTime ? {
  //     level: 'warn',
  //     message: 'An end time is preferred',
  //   } : { level: 'valid' });
  //   const validity = new Map<string, ValidityBody>(Object.entries({
  //     application: applicationValidity,
  //     person: personValidity,
  //     timeperiod: timeperiodValidity,
  //   }).map(([key, props]) => [key, { ...props, label: validityLabels[key as keyof Interaction] || '' }]));
  //   return validity;
  // }, [applicationAutocomplete.value, person, startTime, endTime]);
  // const enableSubmission = useMemo(() => [...validity.values()].every(({ level }) => level !== 'fail'), [validity]);
  // const interaction = useMemo(() => hydrateJobSearchInteraction({
  //   ...existingInteraction,
  //   application: application?.id ? { ...application, id: application.id } : undefined,
  //   notes,
  //   person: person?.id ? { ...person, id: person.id } : undefined,
  //   source: {
  //     entry: 'manual',
  //     [sourceProps.sourceTypeValue]: sourceProps.sourceValue.value,
  //   },
  //   timeperiod: { start: startTime?.getTime() || 0, end: endTime?.getTime() },
  // }), [application, notes, person, sourceProps, startTime, endTime]);

  // Submission
  // const handleCreate = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!enableSubmission) return;
  //   console.log("submitting...", interaction);
  //   // Trigger your "26 minutes ago" label here
  //   createInteraction(interaction);
  // };

  useEffect(() => {
    console.log('creation', createInteractionError, createInteractionIsError, createInteractionIsPending)
  }, [createInteractionError, createInteractionIsError, createInteractionIsPending]);

  return {
    // applicationAutocomplete,

    interaction: existingInteraction,

    // selectedPerson,
    // setPerson,

    startTime,
    endTime,
    setStartTime,
    setEndTime,

    notes,
    handleNotesChange,

    sourceProps,

    // enableSubmission,
    // handleSubmit: handleCreate,
    // validity,
  };
};
