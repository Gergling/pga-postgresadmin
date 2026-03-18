import { Optional } from "../../../shared/types";
import { IdProp } from "../../../shared/lib/typesaurus";

// Flat summariser for simple summarisations.
export const summarise = <T extends IdProp<string>>(
  data: T, keys: (keyof T)[]
) => keys.reduce((acc, key) => ({ ...acc, [key]: data[key] }), { id: data.id } as T);

export const toModel = <T extends object>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id, ...model
}: Optional<IdProp<string>, 'id'> & T): T => model as T;
