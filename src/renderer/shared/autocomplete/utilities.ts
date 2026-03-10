import { createFilterOptions, FilterOptionsState } from "@mui/material";
import { OptionType } from "./types";

// Process a Map extending OptionType mapped to its id, and mark the duplicates clearly.
export const enrichAutocompleteOptions = <T extends OptionType>(options: Map<T['id'], T>) => {
  Map.groupBy(options, (entry) => entry[1].title).forEach((groupOptions) => {
    // If the number of items in this group is less than 1, there is no duplicate.
    if (groupOptions.length < 2) return;

    // Otherwise, we flag the options accordingly.
    groupOptions.forEach(([id, option]) => {
      options.set(id, { ...option, duplicate: true });
    });
  });

  return options;
};

export const getOptionLabel = <T extends OptionType>(option: T | string) => {
  if (typeof option === 'string') return option;
  if (option.title === null) console.warn('getOptionLabel returned a null title:', option);
  return option.title ?? `(null or undefined title for id: ${option.id})`;
}

export const createAutocompleteOptions = <
  ID extends string,
  IdProp extends keyof T,
  TitleProp extends keyof T,
  T extends {
    [key in IdProp]: ID;
  } & {
    [key in TitleProp]: string;
  },
>(
  items: T[],
  {
    idProp,
    titleProp
  }: {
    idProp: IdProp;
    titleProp: TitleProp;
  }
) => items.map((props): OptionType<T[IdProp]> => {
  const id = props[idProp];
  const title = props[titleProp];
  return ({ ...props, id, title, duplicate: false })
});

export const creativeAutocompleteSelectorValidatorFactory = (
  creatingMessage: string,
  options: { requiredMessage: string; } = { requiredMessage: '' }
) => <T extends OptionType>({ value }: { value: T | null }): string | undefined => {
  const { requiredMessage } = options;

  // No selection and an existing selection are both valid for creative autocomplete.
  if (value === null) {
    if (requiredMessage) return requiredMessage;
    return;
  }

  // An existing selection is valid for creative autocomplete.
  if (value.id) return;

  // A selection that doesn't exist yet isn't valid.
  return creatingMessage;
};

export const autocompleteFilterOptionsFactory = <T extends OptionType>() => {
  const filter = createFilterOptions<T>();
  return (
    options: T[],
    params: FilterOptionsState<T>
  ) => {
    const filtered = filter(options, params);
    const { inputValue } = params;
    const isExisting = options.some((option) => inputValue === option.title);
    if (inputValue !== '' && !isExisting) {
      // TODO: Not sure about this casting to T malarky. Makes me feel uncomfortable.
      filtered.push({
        inputValue,
        title: inputValue,
      } as T);
    }
    return filtered;
  };
};
