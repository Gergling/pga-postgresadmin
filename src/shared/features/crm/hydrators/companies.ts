import { hydratorFactory } from "@shared/utilities/initialiser";
import { CrmCompanyCreation } from "../types";

const initial: CrmCompanyCreation = {
  employees: [],
  name: '',
};
export const hydrateCrmCompany = hydratorFactory({ initial });
