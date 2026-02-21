import { CrmArchetype } from '../../../shared/features/crm';
import { OptionType as BaseOptionType } from '../../shared/autocomplete/types';

export type PersonOptionType =
  & BaseOptionType<CrmArchetype['id']['people']>
  & Partial<CrmArchetype['base']['people']>
;
