import React, { useMemo } from 'react';
import {
  AutocompleteRenderInputParams,
  createFilterOptions, 
  FilterOptionsState,
  TextField, 
} from '@mui/material';
import { CrmArchetype } from '../../../../shared/features/crm';
import {
  Autocomplete,
  autocompleteRenderOptionFactory,
  enrichAutocompleteOptions
} from '../../../shared/autocomplete';
import { PersonOptionType as OptionType, useCrmPeople } from '../../crm';

// TODO: Follow the application auto-complete pattern as a template.

const filter = createFilterOptions<OptionType>();

const renderInput = (params: AutocompleteRenderInputParams) => <TextField
  label="Person"
  {...params}
  placeholder="Search or create person..."
  variant="standard"
/>;

const handleFilter = (
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

const createOptionsMap = (
  people: CrmArchetype['base']['people'][]
): Map<OptionType['id'], OptionType> => enrichAutocompleteOptions(
  new Map(people.map(({ id, name: title, ...props }) => [id, { ...props, id, title, duplicate: false }]))
);

export const JobSearchSelectPerson = ({
  person,
  setPerson,
}: {
  person: OptionType | null;
  setPerson: (person: OptionType | null) => void;
}) => {
  const {
    createPerson,
    people,
  } = useCrmPeople();

  const options = useMemo((): Map<OptionType['id'], OptionType> => {
    if (!people) return new Map();
    return createOptionsMap(people);
  }, [people]);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: OptionType
  ) => {
    if (typeof newValue === 'string') {
      setPerson({ title: newValue });
      return;
    }
    if (newValue && newValue.inputValue) {
      setPerson({ title: newValue.inputValue });
      // TODO: When creating the person, it has to be added to the array of people somewhere.
      // This means waiting on the id or updating the people accordingly.
      // Ideally we could just refetch the people once this is completed, having updated the cache appropriately.
      // That part is probably missing.
      createPerson({ name: newValue.inputValue });
      return;
    }
    setPerson(newValue);
  }

  const getOptionLabel = (option: OptionType | string) => {
    if (typeof option === 'string') return option;
    // if (option.inputValue) return option.inputValue;
    return option.title;
  }

  return <Autocomplete
    clearOnBlur
    filterOptions={handleFilter}
    freeSolo
    getOptionLabel={getOptionLabel}
    handleHomeEndKeys
    onChange={handleChange}
    options={[...options.values()]}
    renderOption={autocompleteRenderOptionFactory(options)}
    renderInput={renderInput}
    selectOnFocus
    value={person}
  />
};
