import { useCallback, useMemo } from 'react';
import { useCrmPeopleIpc } from './people-ipc';
import { AutocompleteProps } from '@mui/material';
import { hydrateCrmPerson } from '../../../../shared/features/crm';
import { CrmPersonOptionType } from '../types';
import {
  autocompleteFilterOptionsFactory,
  autocompleteRenderInputFactory,
  createAutocompleteOptions,
  getOptionLabel
} from '@/renderer/shared/autocomplete';

const renderInput = autocompleteRenderInputFactory(
  { label: 'Person' },
  { placeholder: 'Search or create person...' }
);

const getOptionKey = (
  option: string | CrmPersonOptionType
) => typeof option === 'string' ? option : (option.id || option.title);

const baseAutocompleteConfig: Omit<
  AutocompleteProps<CrmPersonOptionType, false, false, boolean>,
  'options'
> = {
  clearOnBlur: true,
  freeSolo: true,
  filterOptions: autocompleteFilterOptionsFactory<CrmPersonOptionType>(),
  getOptionLabel,
  handleHomeEndKeys: true,
  renderInput,
  selectOnFocus: true,
};

export const useCrmPersonCreativeAutocomplete = ({
  person,
  setPerson,
}: {
  person: CrmPersonOptionType | null;
  setPerson: (person: CrmPersonOptionType | null) => void;
}): AutocompleteProps<CrmPersonOptionType, false, false, boolean> => {
  const {
    createPerson,
    people,
  } = useCrmPeopleIpc();

  const options = useMemo(() => {
    if (!people) return [];
    return createAutocompleteOptions([...people.values()], { idProp: 'id', titleProp: 'name' });
  }, [people]);

  const onChange = useCallback((
    event: React.SyntheticEvent<Element, Event>,
    newValue: CrmPersonOptionType | null,
  ) => {
    // When the person selection has been unset, we unset the state.
    if (!newValue) return setPerson(null);

    // When the person doesn't exist, we create it.
    if (!newValue.id) {
      const payload = hydrateCrmPerson({ name: newValue.title });
      return createPerson(payload, (createdData) => {
        setPerson({ title: createdData.name, id: createdData.id });
      });
    }

    if (newValue.inputValue) return setPerson({ id: newValue.id, title: newValue.inputValue });

    setPerson(newValue);
  }, [person, setPerson]);

  return {
    ...baseAutocompleteConfig,
    getOptionKey,
    onChange,
    options,
    value: person,
  };
};
