// Simple control wrapper which defaults to an uneditable data display, unless explicitly switched to edit mode.
// This is to provide a "this doesn't action but FYI" feel.

import { Check, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";

type SafetyControlProps = {
  control: React.ReactNode;
  display: React.ReactNode;
  editable?: boolean;
  editIcon?: React.ReactNode;
  doneIcon?: React.ReactNode;
};
export const SafetyControl = ({ control, display, doneIcon, editIcon, ...props }: SafetyControlProps) => {
  const [editable, setEditable] = useState(props.editable);
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditable(!editable);
  };
  return <>
    {editable ? control : display}
    <IconButton onClick={handleToggle}>{editable ? doneIcon ?? <Check /> : editIcon ?? <Edit />}</IconButton>
  </>;
};
