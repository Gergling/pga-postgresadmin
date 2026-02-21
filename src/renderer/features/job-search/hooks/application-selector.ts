import { AutocompleteProps } from "@mui/material";
import { hydrateJobSearchApplication } from "../../../../shared/features/job-search";
import { autocompleteRenderInputFactory, getOptionLabel } from "../../../shared/autocomplete";
import { applicationSelectionStore } from "../stores/application";
import { JobSearchApplicationOptionType, JobSearchUpsertableApplication } from "../types";
import { useCallback, useMemo } from "react";
import { handleFilter } from "../utilities";
import { autocompleteRenderOptionFactory } from "../components/application-option-factory";
import { useJobSearchApplicationsIpc } from "./application-ipc";

const renderInput = autocompleteRenderInputFactory(
  { label: 'Role' },
  { placeholder: 'Search or create role...' }
);

const getOptionKey = (
  option: string | JobSearchApplicationOptionType
) => typeof option === 'string' ? option : (option.id || option.title);

const baseAutocompleteConfig = {
  clearOnBlur: true,
  freeSolo: true,
  getOptionLabel,
  handleHomeEndKeys: true,
  renderInput,
  selectOnFocus: true,
};

export const useJobSearchApplicationSelector = (): {
  autocomplete: AutocompleteProps<JobSearchApplicationOptionType, false, false, boolean>;
  application: JobSearchUpsertableApplication | undefined;
} => {
  const application = applicationSelectionStore(state => state.model);
  const selectedApplication = applicationSelectionStore(state => state.option);
  const setApplication = applicationSelectionStore(state => state.setApplication);
  const {
    applications, // List of applications from the backend.
    createApplication, // Creates an application in the backend.
  } = useJobSearchApplicationsIpc();

  const options = useMemo((): JobSearchApplicationOptionType[] => {
    if (!applications) return [];
    return [...applications.values()].map(({ id, role: title, ...props }): JobSearchApplicationOptionType => ({ ...props, id, title, duplicate: false }));
  }, [applications]);

  const onChange = useCallback((
    event: React.SyntheticEvent<Element, Event>,
    newValue: JobSearchApplicationOptionType | null,
  ) => {
    // When the application selection has been unset, we unset the state.
    if (!newValue) return setApplication(null);

    // When the application doesn't exist, we create it.
    if (!newValue.id) {
      const payload = hydrateJobSearchApplication({ role: newValue.title });
      createApplication(payload, (createdData) => {
        setApplication({ ...createdData, title: createdData.role });
      });
    }

    if (newValue.inputValue) return setApplication({ title: newValue.inputValue });

    setApplication(newValue);
  }, [createApplication, setApplication]);

  const renderOption = useCallback(
    autocompleteRenderOptionFactory(applications, options),
    [applications, options]
  );

  return {
    application,
    autocomplete: {
      ...baseAutocompleteConfig,
      getOptionKey,
      onChange,
      filterOptions: handleFilter,
      options,
      renderOption,
      value: selectedApplication,
    },
  };
};
