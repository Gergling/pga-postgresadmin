import { getObjectEntries } from "./object";

export const medianDiscrete = <T extends string>(
  series: T[],
  order: readonly T[]
): T => {
  const length = series.length;
  const middle = length / 2;
  const sorted = [...series].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b)
  );
  if (length % 2 === 0) return sorted[middle];
  return sorted[Math.floor(middle)];
};

export const transformTemplateCompilation = <T extends string = string>(
  template: string,
  variables: Record<T, string>,
  options: {
    getKeyParameter: (key: T) => string;
  } = { getKeyParameter: (key) => `{{${key}}}` }
): string => getObjectEntries(variables).reduce((acc, [key, value]) => {
  // Sanitise the input: escape triple backticks so the user cannot break out of
  // the markdown block
  const safeValue = value.replace(new RegExp('```', 'g'), '\'\'\'');
  // Replace all occurrences of {{key}}
  return acc.replace(
    new RegExp(options.getKeyParameter(key), 'g'), safeValue
  );
}, template);
