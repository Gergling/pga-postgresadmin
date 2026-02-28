import { createFilterOptions, FilterOptionsState } from "@mui/material";
import { Mandatory } from "../../../../shared/types";
import { JobSearchArchetype } from "../../../../shared/features/job-search";
import { enrichAutocompleteOptions } from "../../../shared/autocomplete";
import { JobSearchOptionType } from "../types";

type OptionType = JobSearchOptionType<'applications'>;

export const getJobSearchApplicationOption = (
  application: Mandatory<JobSearchArchetype['base']['applications'], 'role'>
): OptionType => ({
  ...application,
  title: application.role,
});

export const createApplicationOptionsMap = (
  applications: JobSearchArchetype['base']['applications'][]
): Map<OptionType['id'], OptionType> => enrichAutocompleteOptions(
  new Map(applications.map(({ id, role: title, ...props }) => [id, { ...props, id, title, duplicate: false }]))
);

const filter = createFilterOptions<OptionType>();

export const handleFilter = (
  options: OptionType[],
  params: FilterOptionsState<OptionType>
) => {
  const filtered = filter(options, params);
  const { inputValue } = params;
  const isExisting = options.some((option) => inputValue === option.title);
  if (inputValue !== '' && !isExisting) {
    filtered.push({
      inputValue,
      title: inputValue,
    });
  }
  return filtered;
}

