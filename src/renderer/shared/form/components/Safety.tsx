// Simple control wrapper which defaults to an uneditable data display, unless
// explicitly switched to edit mode.
// This is to provide a "this doesn't action but FYI" feel.

import { Check, Edit } from "@mui/icons-material";
import { Grid, GridProps, IconButton } from "@mui/material";
import { useState } from "react";
import { WX } from "../types";

type SafetyControlProps = {
  /**
   * The control node. Usually a form field.
   */
  control: React.ReactNode;
  /**
   * The display node. Can be anything, but usually just the value of the item.
   */
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
  /**
   * Extended child props.
   */
  wx?: WX<GridProps, {
    button: WX<GridProps>;
    data: WX<GridProps>;
  }>;
};

// TODO: Wrap the display and control so that the state of editability is more
// clearly expressed.

/**
 * Switches between two modes: control and display.
 */
export const SafetyControl = ({
  control, display, doneIcon, editIcon, wx,
  ...props
}: SafetyControlProps) => {
  const [editable, setEditable] = useState(props.editable);
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditable(!editable);
  };
  return <Grid container spacing={2} {...wx?.props}>
    <Grid size={'grow'} {...wx?.children?.data}>
      {editable ? control : display}
    </Grid>
    <Grid size="auto" {...wx?.children?.button}>
      <IconButton onClick={handleToggle}>
        {editable ? doneIcon ?? <Check /> : editIcon ?? <Edit />}
      </IconButton>
    </Grid>
  </Grid>;
};
