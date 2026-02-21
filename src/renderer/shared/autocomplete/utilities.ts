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

export const getOptionLabel = (option: OptionType | string) => {
  if (typeof option === 'string') return option;
  return option.title;
}
