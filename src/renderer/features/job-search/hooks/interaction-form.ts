import { z } from "zod";
import { useField, useForm } from "@tanstack/react-form";
import { Optional } from "../../../../shared/types";
import { JobSearchDbSchema } from "../../../../shared/features/job-search";
import { OptionType } from "../../../shared/autocomplete";
import { ProgressBarProps, ProgressBarSegmentProps } from "../../../shared/progress-bar/components/ProgressBar";
import { getCrmPersonOption, useCrmPersonCreativeAutocomplete } from "../../crm";
import { getJobSearchApplicationOption, getJobSearchInteractionSourceFieldValue } from "../utilities";
import { useJobSearchApplicationSelector } from "./application-selector";
import { useEffect, useMemo } from "react";

const creativeAutocompleteSelectorValidatorFactory = (
  creatingMessage: string,
  options: { requiredMessage: string; } = { requiredMessage: '' }
) => <T extends OptionType>({ value }: { value: T | null }): string | undefined => {
  const { requiredMessage } = options;

  // No selection and an existing selection are both valid for creative autocomplete.
  if (value === null) {
    if (requiredMessage) return requiredMessage;
    return;
  }

  // An existing selection is valid for creative autocomplete.
  if (value.id) return;

  // A selection that doesn't exist yet isn't valid.
  return creatingMessage;
};

export const useJobSearchInteractionForm = (
  interaction?: Optional<JobSearchDbSchema['base']['interactions'], 'id'>
) => {
  const form = useForm({
    defaultValues: {
      // application: interaction?.application && getJobSearchApplicationOption(interaction.application) || null,
      contentReference: interaction?.contentReference,
      notes: interaction?.notes,
      person: interaction?.person && getCrmPersonOption(interaction.person) || null,
      source: getJobSearchInteractionSourceFieldValue(interaction?.source),
      timeperiod: {
        start: interaction ? new Date(interaction.timeperiod.start) : null,
        end: interaction && interaction.timeperiod.end ? new Date(interaction.timeperiod.end) : null,
      },
    },
    onSubmit: async ({ value }) => {
      // Handle your persistence logic here
      console.log('Submitting:', value);
      //   e.preventDefault();
      //   if (!enableSubmission) return;
      //   console.log("submitting...", interaction);
      //   // Trigger your "26 minutes ago" label here
      //   createInteraction(interaction);

    },
  });

  const personField = useField({
    form, name: 'person',
    validators: {
      onChange: creativeAutocompleteSelectorValidatorFactory('Creating person...'),
    },
  });
  const personAutocomplete = useCrmPersonCreativeAutocomplete({
    person: personField.state.value,
    setPerson: personField.setValue
  });
  
  // const applicationField = useField({
  //   form, name: 'application',
  //   validators: {
  //     onChange: creativeAutocompleteSelectorValidatorFactory('Creating application...'),
  //   },
  // });
  // const applicationAutocomplete = useJobSearchApplicationSelector({
  //   application: applicationField.state.value,
  //   setApplication: applicationField.setValue,
  // });

  const timeperiodStartField = useField({
    form, name: 'timeperiod.start',
    validators: {
      onChange: ({ value: start }) => {
        console.log('this console message never appears')
        // 1. Explicitly catch null first
        if (start === null) return 'Date is required' 

        // 2. Then run your Zod check
        const result = z.date().safeParse(start);
        if (!result.success) {
          return result.error.message;
        }

        // 3. Return undefined for "Success"
        return undefined 
      },
    },
  });
  const timeperiodEndField = useField({ form, name: 'timeperiod.end' });

  const validityProgress = useMemo((): ProgressBarProps => {
    const segments = [
      // applicationField,
      personField,
      timeperiodStartField,
      timeperiodEndField,
    ].map(({ name: message, state: { meta: { isValid } } }) => {
      const status: ProgressBarSegmentProps['status'] = isValid
        ? 'complete'
        : 'pending';
      console.log(message, isValid, status)
      return {
        message,
        status,
      };
    }).sort((a, b) => {
      if (a.status === 'complete') return -1;
      if (b.status === 'complete') return 1;
      return 0;
    });
    return { segments };
  }, [
    // applicationField,
    personField, timeperiodStartField, timeperiodEndField
  ]);

  return {
    form,

    // applicationAutocomplete,
    personAutocomplete,

    timeperiodStartField,

    validityProgress,
  };
};
