import { IdProp } from "../../../shared/lib/typesaurus";

export type CrudModel<T extends IdProp<string>> = Omit<T, 'id'>;
