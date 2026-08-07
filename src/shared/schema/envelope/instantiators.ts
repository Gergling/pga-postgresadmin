import z from "zod";
import {
  RichEnvelope,
  RichEnvelopeSchema,
  SerialisationEnvelope,
  SerialisationEnvelopeSchema
} from "./envelope";
import { EnvelopeCodec, envelopeCodecFactory } from "./codecs";
import { nowUtcZdt, reduceObjectChanges } from "@/shared/utilities";
import { Temporal } from "@js-temporal/polyfill";

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
  changes: Partial<z.infer<TCoreSchemas['rich']>>;
  persistCallback?: (
    serialised: SerialisationEnvelope<TCoreSchemas['serialisation']>,
    changes: Partial<z.infer<TCoreSchemas['rich']>>
  ) => Promise<unknown>;

  constructor(
    { schema, envelope }: EnvelopeConstructorParams<
      TCoreSchemas['rich'], TCoreSchemas['serialisation']
    >
  ) {
    this.schema = schema;
    this.envelope = envelope;
    this.changes = {};
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
        const created = nowUtcZdt();
        const envelope = rich.parse({ created, data });
        return callback({ envelope, schema });
      };
      const fromSerialisedCore = (data: Partial<z.infer<TEncodedCoreSchema>>) => {
        const created = nowUtcZdt();
        const envelope = schema.codec.decode(
          serialisation.parse({ created, data })
        );
        return callback({ envelope, schema });
      };

      return {
        fromCore, fromDb, fromIpc, fromRich, fromSerialisedCore, schema
      };
    };

    return { instantiate, schema };
  }

  updateData(data: Partial<z.infer<TCoreSchemas['rich']>>) {
    this.changes = reduceObjectChanges(this.data.current, {
      ...this.changes, ...data
    });
    return this;
  }

  // audit() {
  //   // TODO: We want a list of objects from the audit log where we can see what the value changed FROM and TO.
  //   // This requires some thought because the keys must be found from the
  //   // previous entries.
  //   return this.envelope.audit.reduce((acc, { data, updated }) => {
  //     return acc;
  //   }, []);
  // }

  serialise() {
    const updated = Temporal.Now.zonedDateTimeISO();
    // TODO: Cycle changes and put the existing values into the 
    // audit based on what changed. This is fine because the updated function
    // will handle applying the changes to the current state when we save.
    const audit = [{ data: this.changes, updated }, ...this.envelope.audit];
    return this.schema.codec.encode({
      ...this.envelope,
      audit, data: this.data.updated,
    });
  }

  get data(): {
    current: z.infer<TCoreSchemas['rich']>;
    updated: z.infer<TCoreSchemas['rich']>;
  } {
    const current = this.envelope[
      'data' as keyof typeof this.envelope
    ] as z.infer<TCoreSchemas['rich']>;
    const updated = { ...current, ...this.changes };
    return { current, updated };
  }

  get id() {
    return this.envelope.id;
  }

  onPersist<T = void>(callback: (
    serialised: SerialisationEnvelope<TCoreSchemas['serialisation']>,
    changes: Partial<z.infer<TCoreSchemas['rich']>>
  ) => Promise<T>) {
    this.persistCallback = callback;
    return this;
  }
  async persist() {
    // Nil permanet sine responso.
    if (!this.persistCallback) throw new Error(
      'No persist callback registered'
    );

    // Run persistence.
    const response = await this.persistCallback(this.serialise(), this.changes);

    // Reset changes after successful persistence.
    this.changes = {};
    return response;
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

// const envelopeFactory = <
//   TCoreSchema extends z.ZodObject,
//   TEncodedCoreSchema extends z.ZodObject,
// >({ rich, serialisation, ...params }: SchemaParams<
//   TCoreSchema, TEncodedCoreSchema
// >) => {
//   // Schema.
//   const schema = {
//     codec: params.codec ?? envelopeCodecFactory<TCoreSchema, TEncodedCoreSchema>(
//       serialisation, rich
//     ),
//     rich, serialisation,
//   };

//   // Instance.
//   const instantiate = <
//     V extends EnvelopeInstance<EnvelopeBaseProps<TCoreSchema, TEncodedCoreSchema>>
//   >(
//     callback: (params: EnvelopeConstructorParams<TCoreSchema, TEncodedCoreSchema>) => V
//   ) => {
//     const fromDb = (raw: unknown) => {
//       const parsed = serialisation.parse(raw);
//       const envelope = schema.codec.decode(parsed);
//       return callback({ envelope, schema });
//     };

//     const fromIpc = (
//       envelope: SerialisationEnvelope<TEncodedCoreSchema>
//     ) => fromDb(envelope);

//     const fromRich = (envelope: RichEnvelope<TCoreSchema>) => {
//       return callback({ envelope, schema });
//     };

//     const fromCore = (data: Partial<z.infer<TCoreSchema>>) => {
//       console.log(data)
//       const created = nowUtcZdt();
//       const envelope = rich.parse({ created, data });
//       return callback({ envelope, schema });
//     };

//     // const toEnvelope = (raw: unknown): RichEnvelope<TCoreSchema> => {
//     //   // serialised core -> serialised envelope
//     //   const parsedSerialisedEnvelope = serialisation.safeParse(raw);
//     //   if (parsedSerialisedEnvelope.success) return toEnvelope(
//     //     parsedSerialisedEnvelope
//     //   );
//     //   const parsedSerialisedCore = serialisation.safeParse(raw);
//     //   parsedSerialisedCore.success
//     //   // rich core -> rich envelope
//     //   const parsedRichCore = serialisation.safeParse(raw);
//     //   parsedRichCore.success
//     //   // serialised envelope -> rich envelope
//     //   const parsedRichEnvelope = rich.safeParse(raw);
//     //   if (parsedRichEnvelope.success) return
//     // };
//     // const from = (raw: unknown) => {
//     //   serialisation.safeParse(raw);
//     //   const envelope = schema.codec.decode(parsed);
//     //   const envelope = rich.parse({ created, data });
//     //   return callback({ envelope, schema });
//     // };

//     return { fromCore, fromDb, fromIpc, fromRich, schema };
//   };

//   return { instantiate, schema };
// };
