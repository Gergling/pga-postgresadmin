import { Mandatory } from "../../../../shared/types";
import { CrmPersonTransfer } from "@shared/features/crm";
import { CrmPersonOptionType } from "../types";
import { creativeAutocompleteSelectorValidatorFactory } from "../../../shared/autocomplete";

export const getCrmPersonOption = (
  person: Mandatory<CrmPersonTransfer, 'name'>
): CrmPersonOptionType => ({
  ...person,
  duplicate: false,
  title: person.name,
});

export const crmPersonSelectorValidator
  = creativeAutocompleteSelectorValidatorFactory('Creating person...');
