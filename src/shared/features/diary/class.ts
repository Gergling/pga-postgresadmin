import { dateSerialisationCodec } from "@/shared/schema";
import { DiaryEntryCore, DiaryEntrySerialisation } from "./schema";

export class DiaryEntry {
  constructor(private envelope: DiaryEntrySerialisation) { }
  static from(envelope: DiaryEntrySerialisation) {
    return new DiaryEntry(envelope);
  }
  serialise(data: Partial<DiaryEntryCore>) {
    return {
      ...this.envelope,
      data: {
        ...this.envelope.data,
        ...data,
      }
    };
  }
  get data() { return this.envelope.data; }
  get created() {
    return dateSerialisationCodec.decode(this.envelope.created);
  }
}
