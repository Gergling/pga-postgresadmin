import { AutocompleteRenderInputParams, TextField, TextFieldProps } from "@mui/material";
import { COLORS } from "../theme";
import { AutocompleteId, AutocompleteListItem, AutocompleteTitle } from "./components.style";
import { OptionType } from "./types";

export const autocompleteRenderOptionFactory = <T extends OptionType>(
  options: T[],
) => {
  const optionsArr = options;
  return (
    props: React.HTMLAttributes<HTMLLIElement>,
    optionProp: string | T,
  ) => {
    const option = typeof optionProp === 'string' ? optionsArr.find(({ title }) => title === optionProp) : optionProp;

    if (!option) {
      console.warn('Shared Factory: how do we not have an option?', optionProp, optionsArr);
      return null;
    }

    return (
      <AutocompleteListItem {...props} key={`${option.id}_${option.title}`}>
        {option.inputValue && (
          <span style={{ color: COLORS.goldGlow, fontWeight: 'bold' }}>
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
