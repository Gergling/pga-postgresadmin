import { Optional } from "../../../../shared/types";
import { hydratorFactory } from "../../../utilities/initialiser";
import { CrmArchetype } from "../types";

const initial: Optional<CrmArchetype['base']['companies'], 'id'> = {
  employees: [],
  name: '',
};
export const hydrateCrmCompany = hydratorFactory({ initial });
