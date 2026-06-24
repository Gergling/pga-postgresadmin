import { SerialisationEnvelope } from '@shared/schema';
import { EventEmitter } from 'events';

const eventType = 'after-write';

export const databaseEventFactory = <
  T extends SerialisationEnvelope<unknown>
>(collectionName: string, on: (envelope: T) => void) => {
  const emitter = new EventEmitter();

  const eventName = `${eventType}:${collectionName}`;
  const emit = (envelope: T) => emitter.emit(eventName, envelope);
  emitter.on(eventName, on);

  return { emit };
};
