import { Envelope } from "../../../../shared/types";

/**
 * @deprecated Use richEnvelope or whatever it's called.
 * @param content 
 * @param id 
 * @param created 
 * @returns 
 */
export const createEnvelope = <T>(content: T, id?: string | number, created?: number): Envelope<T> => ({
  id: id ?? window.crypto.randomUUID(),
  content,
  created: created ?? Date.now(),
});
