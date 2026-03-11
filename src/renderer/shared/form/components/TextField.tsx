import { useCallback, useEffect, useState } from "react";
import { debounce, Grid, IconButton, TextFieldProps } from "@mui/material";
import { StyledTextField } from "./TextField.style";
import { Check, Edit } from "@mui/icons-material";

interface GhostInputProps extends Omit<TextFieldProps, 'onChange'> {
  debounceMs?: number;
  editSwitch?: boolean;
  isTitle?: boolean;
  onPersist: (value: string) => void; // This goes to Zustand/Firebase
  value: string;
}

export const TextField: React.FC<GhostInputProps> = ({ 
  debounceMs = 1000,
  editSwitch,
  isTitle, 
  onPersist, 
  value, 
  ...props 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [disabled, setDisabled] = useState(editSwitch);

  // Keep local value in sync if the global store changes (e.g., external update)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Create the debounced persistence function
  const debouncedPersist = useCallback(
    debounce((nextValue: string) => {
      onPersist(nextValue);
    }, debounceMs),
    [onPersist, debounceMs]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (!editSwitch) debouncedPersist(newValue);
  };

  return (
    <Grid container>
      <Grid size="grow">
        <StyledTextField
          disabled={disabled}
          fullWidth
          isTitle={isTitle}
          multiline
          onChange={handleChange}
          variant="outlined"
          value={localValue}
          {...props}
        />
      </Grid>
      <Grid size="auto">
        {editSwitch && (disabled
          ? <IconButton onClick={() => setDisabled(false)} size="small"><Edit /></IconButton>
          : <IconButton onClick={() => {
            setDisabled(true);
            onPersist(localValue);
          }} size="small"><Check /></IconButton>
        )}
      </Grid>
    </Grid>
  );
};
