import { Autocomplete } from '../../../shared/autocomplete';
import { useCrmCompanyCreativeAutocomplete } from '../hooks';
import { CrmCompanyOptionType } from '../types';

export const CrmCompanyCreativeAutocomplete = ({ setValue, state }: {
  state: { value: CrmCompanyOptionType | null; },
  setValue: (value: CrmCompanyOptionType | null) => void;
}) => {
  const autocomplete = useCrmCompanyCreativeAutocomplete({
    value: state.value,
    setValue,
  });

  return <Autocomplete
    {...autocomplete}
    renderOption={autocomplete.renderOption}
  />
};
