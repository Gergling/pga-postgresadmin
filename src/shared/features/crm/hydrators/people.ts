import { hydratorFactory } from "../../../utilities/initialiser";
import { CrmPersonCreation } from "../types";

const initial: CrmPersonCreation = {
  contactId: {},
  employers: [],
  name: '',
};
export const hydrateCrmPerson = hydratorFactory({ initial });
