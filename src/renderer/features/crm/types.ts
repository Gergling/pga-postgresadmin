import { CrmCompanyTransfer, CrmPersonTransfer, CrmSchema } from '@shared/features/crm';
import { OptionType as BaseOptionType } from '../../shared/autocomplete/types';

export type CrmPersonOptionType =
  & BaseOptionType<CrmSchema['id']['people']>
  & Partial<Omit<CrmPersonTransfer, 'employers'>>
;

export type CrmCompanyOptionType =
  & BaseOptionType<CrmSchema['id']['companies']>
  & Partial<Omit<CrmCompanyTransfer, 'employees'>>
;
