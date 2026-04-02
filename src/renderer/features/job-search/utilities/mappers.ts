import { toTransferDate } from '@shared/utilities/transfer';
import {
  JobSearchApplicationCreation,
  JobSearchApplicationTransfer,
  JobSearchInteractionCreation,
} from "@shared/features/job-search";
import { JobSearchUpdateForm } from "../types";

// Can we be bothered with the form's initial state?
export const jobSearchApplicationToForm = (
  data?: JobSearchApplicationTransfer
): JobSearchUpdateForm => ({
  application: {
    isListingSourceType: data?.sourceType === 'listing',
    notes: '',
    onSite: false,
    pending: false,
    phase: 'sourced',
    role: '',
    salary: {},
    stages: [],
    ...data,
    agency: null,
    company: null,
    manager: null,
    referral: null,
  },
  interaction: {
    due: null,
    notes: '',
    person: null,
    source: {
      type: 'email',
      value: '',
    },
    timeperiod: {
      start: null,
      end: null,
    },
  },
});

export function jobSearchUpdateFormToCreation(
  update: JobSearchUpdateForm
): JobSearchInteractionCreation;
export function jobSearchUpdateFormToCreation(
  update: JobSearchUpdateForm
): JobSearchInteractionCreation;
export function jobSearchUpdateFormToCreation(
  update: JobSearchUpdateForm
): JobSearchInteractionCreation {
  const application: JobSearchApplicationCreation = {
    ...update.application,
    sourceType: update.application.isListingSourceType ? 'listing' : 'agent',
  };

  if (!update.interaction.timeperiod.start) {
    // Return an application.
    
    return;
  }

  const interaction: JobSearchInteractionCreation = {
    ...update.interaction,
    applications: [application],
    due: toTransferDate(update.interaction.due),
    person: update.interaction.person?.id ? {
      id: update.interaction.person.id,
      name: update.interaction.person.name ?? '',
    } : undefined,
    source: {
      entry: 'manual',
      [update.interaction.source.type]: update.interaction.source.value,
    },
    timeperiod: {
      // It shouldn't be null at this point, but we'd have to make a special exception for the input type. Yay.
      start: toTransferDate(update.interaction.timeperiod.start),
      end: toTransferDate(update.interaction.timeperiod.end),
    },
  };
  return interaction;
}

// export const jobSearchApplicationToTransfer = (
//   update: JobSearchUpdateForm
// ): JobSearchApplicationTransfer => {};
