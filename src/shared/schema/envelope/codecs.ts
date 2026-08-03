import z from "zod";
import { codec } from "@/shared/utilities";
import { dateSerialisationCodec } from "../date";
import { RichEnvelope, RichEnvelopeSchema, SerialisationEnvelope, SerialisationEnvelopeSchema } from "./envelope";

/**
 * Decodes from a serialisationSchema into a richSchema
 * @param serialisationSchema The serialisable schema for this data.
 * @param richSchema The rich schema for this data.
 * @returns a Codec.
 */
export const envelopeCodecFactory = <
  Core extends z.ZodObject, SerialisedCore extends z.ZodObject = Core
>(
  serialisationSchema: SerialisationEnvelopeSchema<SerialisedCore>,
  richSchema: RichEnvelopeSchema<Core>,
) => codec<RichEnvelope<Core>, SerialisationEnvelope<SerialisedCore>>({
  encode: ({ audit, created, ...value }): SerialisationEnvelope<SerialisedCore> => {
    const encodedAudit = audit.map(({ updated, ...item }) => ({
      ...item, updated: dateSerialisationCodec.encode(updated)
    }));
    const encodedCreated = dateSerialisationCodec.encode(created);
    return serialisationSchema.parse({
      ...value, audit: encodedAudit, created: encodedCreated
    });
  },
  decode: ({ audit, created, ...value }): RichEnvelope<Core> => {
    const decodedAudit = audit.map(({ updated, ...item }) => ({
      ...item, updated: dateSerialisationCodec.decode(updated)
    }));
    const decodedCreated = dateSerialisationCodec.decode(created);
    return richSchema.parse({
      ...value, audit: decodedAudit, created: decodedCreated
    });
  },
});

export type EnvelopeCodec<
  Core extends z.ZodObject,
  SerialisedCore extends z.ZodObject = Core
> = ReturnType<typeof envelopeCodecFactory<Core, SerialisedCore>>;
