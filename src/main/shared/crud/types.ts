import { WithId } from "../../../shared/lib/typesaurus";

export type CrudModel<T extends WithId<string>> = Omit<T, 'id'>;

export type RecordAudit<Record extends WithId<string>> = {
  previous: Partial<CrudModel<Record>>;
  time: number;
};
