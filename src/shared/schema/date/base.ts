import z from "zod";

const typeOfTypesSchema = z.enum(['object', 'string']);
type TypeOfTypes = z.infer<typeof typeOfTypesSchema>;

const temporalInputFormatTypes = z.enum([
  'ZonedDateTimeLike', 'RFC date with timezone abbreviation'
]);
export type TemporalInputFormatType = z.infer<typeof temporalInputFormatTypes>;

export type TemporalTransformError = {
  expected: TypeOfTypes;
  format: TemporalInputFormatType;
};

export type TemporalTransformResponseBase<T> = {
  type: 'success';
  value: T;
} | {
  type: 'error';
  errors: TemporalTransformError[];
};
