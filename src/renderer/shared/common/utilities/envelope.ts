import { Envelope } from "../../../../shared/types";

export const createEnvelope = <T>(content: T, id?: string | number, created?: number): Envelope<T> => ({
  id: id ?? window.crypto.randomUUID(),
  content,
  created: created ?? Date.now(),
});
