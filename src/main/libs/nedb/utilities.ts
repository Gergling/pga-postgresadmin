import { app } from 'electron';
import Datastore from '@seald-io/nedb';
import { dateSerialisationCodec, SerialisationEnvelope } from '@/shared/schema';
import { Temporal } from '@js-temporal/polyfill';

export const setupLocalNeDb = <T extends SerialisationEnvelope<unknown>>(
  collectionName: string,
) => {
  const appDataPath = app.getPath('userData');
  const local = new Datastore<T>({
    autoload: true, filename: `${appDataPath}/${collectionName}.db`,
  });

  local.setAutocompactionInterval(1000 * 60 * 60 * 12);

  return local;
};

export const transformEnvelopeBeforeUpdate = <Data, T extends SerialisationEnvelope<Data>>(
  envelope: T
): T => {
  const updated = dateSerialisationCodec.encode(Temporal.Now.zonedDateTimeISO());
  const audit = [{ data: envelope.data, updated }, ...envelope.audit];

  return {
    ...envelope,
    audit,
  };
};

// Before update: audit should have data prepended.
// After update: run emitter.emit(`update:${collectionName}`).
