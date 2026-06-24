import { Temporal } from "@js-temporal/polyfill";
import { resolveAbbreviation } from "@/shared/utilities";
import {
  TemporalInputFormatType,
  TemporalTransformError,
  TemporalTransformResponseBase
} from "./base";

type TemporalDecoder = (
  match: RegExpMatchArray
) => Temporal.ZonedDateTimeLike;


type TemporalTransformResponse = TemporalTransformResponseBase<
  Temporal.ZonedDateTime
>;

const temporalProps = [
  'day', 'month', 'year', 'hour', 'minute', 'second'
] as const;

const f = (
  regexp: RegExp,
  decoder: TemporalDecoder,
  inputFormatType: TemporalInputFormatType,
) => (value: string) => {
  const match = value.match(regexp);
  if (match) {
    return decoder(match);
  }
  return inputFormatType;
};

const decoders = [
  f(
    /(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s([A-Z]{3,4})/,
    (match) => {
      const [, day, month, year, hour, minute, second] = match.map(Number);
      const [, , , , , , , abbreviation] = match;
      const timeZone = resolveAbbreviation(abbreviation, year);
      return { day, month, year, hour, minute, second, timeZone };
    },
    'RFC date with timezone abbreviation',
  )
];

export const transformStringToZonedDateTime = (
  value: string
): TemporalTransformResponse => {
  let errors: TemporalTransformError[] = [];
  for (const decoder of decoders) {
    const result = decoder(value);
    if (typeof result !== 'string') {
      return {
        type: 'success',
        value: Temporal.ZonedDateTime.from(result),
      };
    }
    errors.push({
      expected: 'string',
      format: result,
    });
  }
  return {
    type: 'error',
    errors
  };
};

export const transformToZonedDateTime = (
  value: unknown
): TemporalTransformResponse => {
  let errors: TemporalTransformError[] = [];
  if (typeof value === 'object' && value !== null) {
    const isTemporalLike = temporalProps.some(prop => prop in value);
    if (isTemporalLike) return {
      type: 'success',
      value: Temporal.ZonedDateTime.from(value)
    };
    if (
      'epochMilliseconds' in value && 'timeZoneId' in value &&
      typeof value.epochMilliseconds === 'number' &&
      typeof value.timeZoneId === 'string'
    ) return {
      type: 'success',
      value: Temporal.Instant.fromEpochMilliseconds(
        value.epochMilliseconds
      ).toZonedDateTimeISO(value.timeZoneId)
    };
    errors.push({
      expected: 'object',
      format: 'ZonedDateTimeLike'
    });
  }
  if (typeof value === 'string') {
    const result = transformStringToZonedDateTime(value);
    if (result.type === 'success') return result;
    errors = [...errors, ...result.errors];
  }
  return {
    type: 'error',
    errors,
  };
};
