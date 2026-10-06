import { dateSerialisationCodec, Envelope } from "@/shared/schema";
import {
  DiaryEntryCore,
  DiaryEntrySerialisation,
} from "./schema";
import { Temporal } from "@js-temporal/polyfill";

abstract class SerialisedEnvelope<
  T extends Envelope
> {
  readonly created: Temporal.ZonedDateTime;
  constructor(protected envelope: T) {
    this.created = dateSerialisationCodec.decode(envelope.created);
  }
  get data() { return this.envelope.data; }
  get id() { return this.envelope.id; }
}

export class DiaryEntry extends SerialisedEnvelope<DiaryEntrySerialisation> {
  constructor(envelope: DiaryEntrySerialisation) {
    super(envelope);
  }
  static from(envelope: DiaryEntrySerialisation) {
    return new DiaryEntry(envelope);
  }
  serialise(data?: Partial<DiaryEntryCore>) {
    return {
      ...this.envelope,
      data: {
        ...this.data,
        ...data,
      }
    };
  }

  get data() { return this.envelope.data; }
  get status() { return this.envelope.data.status; }
  get text() { return this.envelope.data.text; }
}
