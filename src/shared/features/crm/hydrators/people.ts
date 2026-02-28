import { Optional } from "../../../../shared/types";
import { hydratorFactory } from "../../../utilities/initialiser";
import { CrmArchetype } from "../types";

const initial: Optional<CrmArchetype['base']['people'], 'id'> = {
  contactId: {},
  employers: [],
  name: '',
};
export const hydrateCrmPerson = hydratorFactory({ initial });
