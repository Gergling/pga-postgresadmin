import { codec } from "@/shared/utilities";
import {
  TaskCoreTimelineRich,
  TaskCoreTimelineSerialised
} from "../schema";
import { dateSerialisationCodec } from "@/shared/schema";

type K = keyof TaskCoreTimelineRich;

const codecWrapper = <From, To>(
  obj: Partial<Record<K, From>>,
  codec: (value: NonNullable<From>) => To,
) => Object.keys(['completed', 'due', 'start']).reduce(
  (acc, key) => {
    const value = obj[key as K];
    if (value !== undefined) return {
      ...acc,
      [key]: codec(value as NonNullable<From>),
    }
    return acc;
  },
  {} as Record<K, To>,
)

export const taskTimelineCodec = codec<
  TaskCoreTimelineRich,
  TaskCoreTimelineSerialised
>({
  decode: (serialised) => codecWrapper(
    serialised,
    (value) => dateSerialisationCodec.decode(value),
  ),
  encode: (deserialised) => codecWrapper(
    deserialised,
    (value) => dateSerialisationCodec.encode(value),
  ),
});
