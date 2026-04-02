// Simple control wrapper which defaults to an uneditable data display, unless explicitly switched to edit mode.
// This is to provide a "this doesn't action but FYI" feel.

import { Check, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";

type SafetyControlProps = {
  control: React.ReactNode;
  display: React.ReactNode;
  /**
   * If true, shows the control, otherwise the display.
   */
  editable?: boolean;
  /**
   * The icon that represents switching to edit mode, which displays the
   * control.
   */
  editIcon?: React.ReactNode;
  /**
   * The icon that represents switching to display mode.
   */
  doneIcon?: React.ReactNode;
};
/**
 * Switches between two modes: control and display.
 */
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
