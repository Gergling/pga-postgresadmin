export const formatEfficiency = (
  value: number
) => (Number.isNaN(value) ? 0 : value).toFixed(1);

export const placeholderNaN = (value: number) => {
  if (Number.isNaN(value)) return '-';
  return value.toFixed(1);
};
