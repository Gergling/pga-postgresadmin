import { OptionType } from "./types";
import { AutocompleteId, AutocompleteListItem, AutocompleteTitle } from "./components.style";
import { AutocompleteRenderInputParams, TextField, TextFieldProps } from "@mui/material";

export const autocompleteRenderOptionFactory = <T extends OptionType>(
  options: Map<T['id'], T>,
) => {
  const optionsArr = [...options.values()];
  return (
    props: React.HTMLAttributes<HTMLLIElement>,
    optionProp: string | T,
  ) => {
    const option = typeof optionProp === 'string' ? optionsArr.find(({ title }) => title === optionProp) : optionProp;

    if (!option) {
      console.warn('how do we not have an option?', optionProp, optionsArr)
      return null;
    }

    return (
      <AutocompleteListItem {...props} key={`${option.id}_${option.title}`}>
        {option.inputValue && (
          // TODO: Another one for styling standards...
          <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>
            + CREATE: {option.inputValue}
          </span>
        )}
        <AutocompleteTitle>{option.title}</AutocompleteTitle>
        {option.duplicate && <AutocompleteId>({option.id?.substring(0, 4)}...)</AutocompleteId>}
      </AutocompleteListItem>
    );
  };
};

export const autocompleteRenderInputFactory = (
  initialParams: TextFieldProps,
  overrideParams: Partial<TextFieldProps>
) => (
  params: AutocompleteRenderInputParams
) => <TextField
  {...initialParams}
  {...params}
  variant="standard"
  {...overrideParams}
/>;

