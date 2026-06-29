import { SerialisationEnvelope } from '@/shared/schema';
import { instantiateNeDbWrapper } from './instantiator';

export const setupBasicNeDb = <T>(
  collectionName: string
) => instantiateNeDbWrapper<T>(collectionName);

export const setupLocalNeDb = <T extends SerialisationEnvelope<unknown>>(
  collectionName: string,
) => {
  const local = setupBasicNeDb<T>(collectionName);

  local.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

  return local;
};
