import { useField, useForm } from "@tanstack/react-form";
import z from "zod";
import { JobSearchApplicationTransfer } from "@shared/features/job-search";
import { useFlags } from "@/renderer/shared/common/hooks/flags";
import {
  crmCompanySelectorValidator,
  crmPersonSelectorValidator
} from "../../crm";
import { jobSearchApplicationToForm } from "../utilities";
import { JobSearchUpdateForm } from "../types";
import { useJobSearchIpcUpdate } from "./update-ipc";
import { useJobSearchInteractionSource } from "./interaction-source-selector";

// const useOptionTypeDto = (
//   application?: OptionalId<JobSearchApplicationTransfer>
// ) => {
//   const { company: agency } = useCrmCompanyIpc(application?.agency?.id);
//   const { company } = useCrmCompanyIpc(application?.company?.id);
//   const { person: manager } = useCrmPeopleIpc(application?.manager?.id);
//   const { person: referral } = useCrmPeopleIpc(application?.referral?.id);

//   return { agency, company, manager, referral };
// };

const dateSchema = z.date(); // Validates it's a Date and not null

export const useJobSearchUpdateForm = (
  application?: JobSearchApplicationTransfer
) => {
  const {
    create,
    createIsError: createApplicationIsError,
    createIsPending: createApplicationIsPending,
    createError: createApplicationError,
  } = useJobSearchIpcUpdate();
  // const optionTypeData = useOptionTypeDto(application);
  const applicationFormData = jobSearchApplicationToForm(application);

  const form = useForm({
    defaultValues: applicationFormData,
    onSubmit: async ({ value }) => {
      console.log('submitting...', value)
      // This is where we transform the form data into payload data.
      // const startDateResult = dateSchema.safeParse(value.interaction.timeperiod.start);

      // if (!startDateResult.success) throw new Error('Invalid start date');

      // const validForm: JobSearchUpdateForm = {
      //   ...value,
      //   interaction: {
      //     ...value.interaction,
      //     timeperiod: {
      //       // ...value.interaction.timeperiod,
      //       start: startDateResult.data,
      //       end: value.interaction.timeperiod.end
      //         ? new Date(value.interaction.timeperiod.end)
      //         : null,
      //     },
      //   },
      // };

      // TODO:
      // New manual application (e.g. from job listing) -> create application
      // New manual interaction (e.g. from agent) -> create interaction
      // New manual interaction about application (e.g. from agent) ->
        // create interaction
      // Both could output full objects of what is created as standard, rather
      // than just the object and its summary.
      // Have a relationship transfer type
      // In this case, we do one of the following:
        // We return the application(s) and the newly-created interaction
        // We return the application
        // We return the interaction
      // So the tedious refactoring will look as follows:
        // createApplication returns the application and (optional) interaction
        // createInteraction returns the interaction and array of applications
        // So the template type would extend object and the relationship type(s)
          // would extend object[]

      create(value, (data) => {
        // Whatever needs to happen for the state change, happens here.
        console.log('Created application:', data)
      });
    },
  });

  const company = useField({
    form, name: 'application.company',
    validators: {
      onChange: crmCompanySelectorValidator,
    }
  });
  const agency = useField({
    form, name: 'application.agency',
    validators: {
      onChange: crmCompanySelectorValidator,
    }
  });

  const manager = useField({
    form, name: 'application.manager',
    validators: {
      onChange: crmPersonSelectorValidator,
    }
  });
  const referral = useField({
    form, name: 'application.referral',
    validators: {
      onChange: crmPersonSelectorValidator,
    }
  });

  const phase = useField({
    form, name: 'application.phase',
  });
  const stages = useField({
    form, name: 'application.stages',
  });

  const interactionPerson = useField({
    form, name: 'interaction.person',
    validators: {
      onChange: crmPersonSelectorValidator,
    }
  });

  // Need to transform source into this
  // type JobSearchInteractionSourceProps = {
  //   sourceType: DropdownProps;
  //   sourceValue: TextFieldProps;
  // };
  // useJobSearchInteractionSource();
  
  // const sourceProps = useField({
  //   form, name: 'interaction.source',
  // });
  // sourceProps.state.value

  const fieldVisibility = useFlags({
    agency: application?.sourceType === 'agent'
      || application?.agency !== undefined,
    source: application?.agency !== undefined,
    pending: application?.pending !== undefined,
  });

  return {
    createApplicationError,
    createApplicationIsError,
    createApplicationIsPending,

    form, fieldVisibility,
    agency, company,
    manager, referral,
    phase, stages,

    interactionPerson,
  };
};
