import { Autocomplete } from '../../../shared/autocomplete';
import { CrmPersonOptionType, useCrmPersonCreativeAutocomplete } from '..';

export const CrmPersonCreativeAutocomplete = ({ setValue, state }: {
  state: { value: CrmPersonOptionType | null; },
  setValue: (value: CrmPersonOptionType | null) => void;
}) => {
  const personAutocomplete = useCrmPersonCreativeAutocomplete({
    person: state.value,
    setPerson: setValue,
  });

  return <Autocomplete {...personAutocomplete} />
};
