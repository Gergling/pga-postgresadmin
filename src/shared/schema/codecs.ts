import { ZodType } from "zod";
import { codec } from "@/shared/utilities";
import { dateSerialisationCodec, RichDate, SerialisationDate } from "./date";
import { RichEnvelope, SerialisationEnvelope } from "./envelope";

/**
 * Decodes from a serialisationSchema into a richSchema
 * @param serialisationSchema The serialisable schema for this data.
 * @param richSchema The rich schema for this data.
 * @returns a Codec.
 */
export const envelopeCodecFactory = <T>(
  serialisationSchema: ZodType<SerialisationEnvelope<T>>,
  richSchema: ZodType<RichEnvelope<T>>,
) => codec<RichEnvelope<T>, SerialisationEnvelope<T>>({
  encode: ({ audit, created, ...value }) => {
    const encodedAudit = audit.map(({ updated, ...item }) => ({
      ...item, updated: dateSerialisationCodec.encode(updated)
    }));
    const encodedCreated = dateSerialisationCodec.encode(created);
    return serialisationSchema.parse({
      ...value, audit: encodedAudit, created: encodedCreated
    });
  },
  decode: ({ audit, created, ...value }) => {
    const decodedAudit = audit.map(({ updated, ...item }) => ({
      ...item, updated: dateSerialisationCodec.decode(updated)
    }));
    const decodedCreated = dateSerialisationCodec.decode(created);
    return richSchema.parse({
      ...value, audit: decodedAudit, created: decodedCreated
    });
  },
});
