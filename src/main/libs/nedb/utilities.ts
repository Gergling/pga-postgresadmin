import { app } from 'electron';
import Datastore from '@seald-io/nedb';
import { SerialisationEnvelope } from '@/shared/schema';

export const setupBasicNeDb = <T>(collectionName: string) => {
  const appDataPath = app.getPath('userData');
  return new Datastore<T>({
    autoload: true, filename: `${appDataPath}/${collectionName}.db`,
  });
}

export const setupLocalNeDb = <T extends SerialisationEnvelope<unknown>>(
  collectionName: string,
) => {
  const local = setupBasicNeDb<T>(collectionName);

  local.setAutocompactionInterval(1000 * 60 * 60 * 12);

  return local;
};
