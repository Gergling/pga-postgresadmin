import { Temporal } from "@js-temporal/polyfill";
import { dateSerialisationCodec } from "../date";
import { SerialisationEnvelope } from "./envelope";

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
