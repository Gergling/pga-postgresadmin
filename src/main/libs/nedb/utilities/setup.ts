import { SerialisationEnvelope } from '@/shared/schema';
import { instantiateNeDbWrapper } from './instantiator';
import { ZodRawShape } from 'zod';

export const setupBasicNeDb = <T extends object>(
  collectionName: string
) => instantiateNeDbWrapper<T>(collectionName);

export const setupLocalNeDb = <T extends SerialisationEnvelope<ZodRawShape>>(
  collectionName: string,
) => {
  const local = setupBasicNeDb<T>(collectionName);

  local.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

  return local;
};
