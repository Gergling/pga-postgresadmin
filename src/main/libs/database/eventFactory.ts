import { SerialisationEnvelope } from '@/shared/schema';
import { EventEmitter } from 'events';
import { ZodRawShape } from 'zod';

const eventType = 'after-write';

export const databaseEventFactory = <
  T extends SerialisationEnvelope<ZodRawShape>
>(collectionName: string, on: (envelope: T) => void) => {
  const emitter = new EventEmitter();

  const eventName = `${eventType}:${collectionName}`;
  const emit = (envelope: T) => emitter.emit(eventName, envelope);
  emitter.on(eventName, on);

  return { emit };
};
