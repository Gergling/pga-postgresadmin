import { Temporal } from "@js-temporal/polyfill";
import { codec } from "@/shared/utilities";
import { RichDate } from "./rich";
import { SerialisationDate } from "./serialisation";

export const dateSerialisationCodec = codec<RichDate, SerialisationDate>({
  encode: (value) => Temporal.ZonedDateTime.from(value),
  decode: ({
    epochMilliseconds, timeZoneId
  }) => Temporal.Instant.fromEpochMilliseconds(
    epochMilliseconds
  ).toZonedDateTimeISO(timeZoneId),
});
