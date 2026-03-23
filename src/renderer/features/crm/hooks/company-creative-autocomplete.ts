import { useCallback, useMemo } from 'react';
import { AutocompleteProps } from '@mui/material';
import {
  autocompleteFilterOptionsFactory,
  autocompleteRenderInputFactory,
  autocompleteRenderOptionFactory,
  createAutocompleteOptions,
  getOptionLabel,
} from '../../../shared/autocomplete';
import { hydrateCrmCompany } from '../../../../shared/features/crm';
import { CrmCompanyOptionType } from '../types';
import { useCrmCompanyIpc } from './company-ipc';

const renderInput = autocompleteRenderInputFactory(
  { },
  { placeholder: 'Search or create organisation...' }
);

const getOptionKey = (
  option: string | CrmCompanyOptionType
) => typeof option === 'string' ? option : (option.id || option.title);

const baseAutocompleteConfig: Omit<
  AutocompleteProps<CrmCompanyOptionType, false, false, boolean>,
  'options'
> = {
  clearOnBlur: true,
  filterOptions: autocompleteFilterOptionsFactory<CrmCompanyOptionType>(),
  freeSolo: true,
  getOptionLabel,
  handleHomeEndKeys: true,
  renderInput,
  selectOnFocus: true,
};

export const useCrmCompanyCreativeAutocomplete = ({
  value,
  setValue,
}: {
  value: CrmCompanyOptionType | null;
  setValue: (person: CrmCompanyOptionType | null) => void;
}): AutocompleteProps<CrmCompanyOptionType, false, false, boolean> => {
  const {
    companies,
    createCompany,
  } = useCrmCompanyIpc();

  const options = useMemo(() => {
    if (!companies) return [];
    return createAutocompleteOptions(companies, { idProp: 'id', titleProp: 'name' });
  }, [companies]);

  const onChange = useCallback((
    event: React.SyntheticEvent<Element, Event>,
    newValue: CrmCompanyOptionType | null,
  ) => {
    // When the person selection has been unset, we unset the state.
    if (!newValue) return setValue(null);

    // When the person doesn't exist, we create it.
    if (!newValue.id) {
      const payload = hydrateCrmCompany({ name: newValue.title });
      return createCompany(payload, (createdData) => {
        setValue({ title: createdData.name, id: createdData.id });
      });
    }

    if (newValue.inputValue) return setValue({ id: newValue.id, title: newValue.inputValue });

    setValue(newValue);
  }, [value, setValue]);

  const renderOption = useCallback(
    autocompleteRenderOptionFactory(options),
    [options]
  );

  return {
    ...baseAutocompleteConfig,
    getOptionKey,
    onChange,
    options,
    renderOption,
    value,
  };
};
