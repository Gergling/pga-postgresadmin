import z, { ZodType } from "zod";
import { TransferEnvelope } from "./transfer";
import { Envelope } from "./base";

export const ipcCodec = <C>(
  base: ZodType<Envelope<C>>, transfer: ZodType<TransferEnvelope<C>>
) => z.codec<ZodType<Envelope<C>>, ZodType<TransferEnvelope<C>>>(
  base, transfer,
  {
    decode: (value) => transfer.parse(value),
    encode: (value) => ({ ...base.parse(value), creationKey: undefined }),
  }
);
