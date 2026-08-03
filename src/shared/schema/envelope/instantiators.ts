import z from "zod";
import {
  RichEnvelope,
  RichEnvelopeSchema,
  SerialisationEnvelope,
  SerialisationEnvelopeSchema
} from "./envelope";
import { EnvelopeCodec, envelopeCodecFactory } from "./codecs";
import { nowUtcZdt } from "@/shared/utilities";

type EnvelopeBaseProps<
  TCoreSchema extends z.ZodObject = z.ZodObject,
  TEncodedCoreSchema extends z.ZodObject = z.ZodObject,
> = {
  rich: TCoreSchema;
  serialisation: TEncodedCoreSchema;
};

type SchemaParams<
  T extends z.ZodObject,
  TEncoded extends z.ZodObject = T
> = {
  codec?: EnvelopeCodec<T, TEncoded>;
  rich: RichEnvelopeSchema<T>;
  serialisation: SerialisationEnvelopeSchema<TEncoded>;
};

type EnvelopeConstructorParams<
  T extends z.ZodObject,
  TEncoded extends z.ZodObject = T
> = {
  envelope: RichEnvelope<T>;
  schema: Required<SchemaParams<T, TEncoded>>;
};


// Probably we can just make a class that does what the function does, AND make
// it a base class.
export class EnvelopeInstance<
  TCoreSchemas extends EnvelopeBaseProps,
> {
  schema: Required<SchemaParams<TCoreSchemas['rich'], TCoreSchemas['serialisation']>>;
  envelope: RichEnvelope<TCoreSchemas['rich']>;
  persistCallback?: (
    envelope: SerialisationEnvelope<TCoreSchemas['serialisation']>
  ) => Promise<unknown>;

  constructor(
    { schema, envelope }: EnvelopeConstructorParams<
      TCoreSchemas['rich'], TCoreSchemas['serialisation']
    >
  ) {
    this.schema = schema;
    this.envelope = envelope;
  }
  static from<
    TCoreSchema extends z.ZodObject,
    TEncodedCoreSchema extends z.ZodObject,
  >({ rich, serialisation, ...params }: SchemaParams<TCoreSchema, TEncodedCoreSchema>) {
    const schema = {
      codec: params.codec ?? envelopeCodecFactory<TCoreSchema, TEncodedCoreSchema>(
        serialisation, rich
      ),
      rich, serialisation,
    };
    const instantiate = <
      V extends EnvelopeInstance<EnvelopeBaseProps<TCoreSchema, TEncodedCoreSchema>>
    >(
      callback: (params: EnvelopeConstructorParams<TCoreSchema, TEncodedCoreSchema>) => V
    ) => {
      const fromDb = (raw: unknown) => {
        const parsed = serialisation.parse(raw);
        const envelope = schema.codec.decode(parsed);
        return callback({ envelope, schema });
      };

      const fromIpc = (
        envelope: SerialisationEnvelope<TEncodedCoreSchema>
      ) => fromDb(envelope);

      const fromRich = (envelope: RichEnvelope<TCoreSchema>) => {
        return callback({ envelope, schema });
      };

      const fromCore = (data: Partial<z.infer<TCoreSchema>>) => {
        console.log(data)
        const created = nowUtcZdt();
        const envelope = rich.parse({ created, data });
        return callback({ envelope, schema });
      };

      return { fromCore, fromDb, fromIpc, fromRich, schema };
    };

    return { instantiate, schema };
  }

  updateData(data: Partial<z.infer<TCoreSchemas['rich']>>) {
    this.envelope = this.schema.rich.parse({ ...this.envelope, data });
    return this;
  }

  serialise() {
    return this.schema.codec.encode(this.envelope);
  }

  get id() {
    return this.envelope.id;
  }

  async onPersist<T = void>(callback: (
    envelope: SerialisationEnvelope<TCoreSchemas['serialisation']>
  ) => Promise<T>) {
    this.persistCallback = callback;
  }
  async persist() {
    if (!this.persistCallback) throw new Error('No persist callback registered');

    const serialised = this.serialise();
    return this.persistCallback(serialised);
  }
}

export type EnvelopeFactory<
  T extends ReturnType<typeof EnvelopeInstance.from>
> = {
  base: EnvelopeBaseProps<
    T['schema']['rich']['shape']['data'],
    T['schema']['serialisation']['shape']['data']
  >;
  params: EnvelopeConstructorParams<
    T['schema']['rich']['shape']['data'],
    T['schema']['serialisation']['shape']['data']
  >;
};
