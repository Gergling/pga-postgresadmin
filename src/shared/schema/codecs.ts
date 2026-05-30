import { ZodType } from "zod";
import { codec } from "@/shared/utilities";
import { temporalCodec } from "@/shared/lib/temporal";
import { UiEnvelope } from "./ui";
import { TransferEnvelope } from "./transfer";

/**
 * Decodes from a transferSchema into a uiSchema
 * @param transferSchema The serialisable IPC transfer schema for this data.
 * @param uiSchema The UI schema for this data.
 * @returns a Codec.
 */
export const ipcCodecFactory = <T>(
  transferSchema: ZodType<TransferEnvelope<T>>,
  uiSchema: ZodType<UiEnvelope<T>>,
) => codec<UiEnvelope<T>, TransferEnvelope<T>>({
  encode: ({ audit, created, ...value }) => {
    const encodedAudit = audit.map(({ updated, ...item }) => ({
      ...item, updated: temporalCodec.encode(updated)
    }));
    const encodedCreated = temporalCodec.encode(created);
    return transferSchema.parse({
      ...value, audit: encodedAudit, created: encodedCreated
    });
  },
  decode: ({ audit, created, ...value }) => {
    const decodedAudit = audit.map(({ updated, ...item }) => ({
      ...item, updated: temporalCodec.decode(updated)
    }));
    const decodedCreated = temporalCodec.decode(created);
    return uiSchema.parse({
      ...value, audit: decodedAudit, created: decodedCreated
    });
  },

});
