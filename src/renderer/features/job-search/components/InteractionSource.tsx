import { TextField, TextFieldProps } from "@mui/material";
import { Dropdown, DropdownProps } from "../../../shared/common/components/Dropdown";

type JobSearchInteractionSourceProps = {
  sourceType: DropdownProps;
  sourceValue: TextFieldProps;
};

export const JobSearchInteractionSource = ({
  sourceType,
  sourceValue,
}: JobSearchInteractionSourceProps) => {
  return <>
    <Dropdown {...sourceType} />
    <TextField {...sourceValue} />
  </>;
};
