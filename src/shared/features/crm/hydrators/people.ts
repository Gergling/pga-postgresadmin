import { hydratorFactory } from "@shared/utilities/initialiser";
import { OptionalId } from "@shared/lib/typesaurus";
import { CrmPersonCreation, CrmPersonTransfer } from "../types";

export const hydrateCrmPerson = hydratorFactory<
  OptionalId<CrmPersonCreation | CrmPersonTransfer>
>({
  initial: {
    contactId: {},
    employers: [],
    name: '',
  }
});
