import { useCallback, useEffect, useState } from "react";
import { debounce, TextFieldProps } from "@mui/material";
import { StyledTaskDescriptionInput } from "./DescriptionInput.style";

interface GhostInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onPersist: (value: string) => void; // This goes to Zustand/Firebase
  isTitle?: boolean;
  debounceMs?: number;
}

export const TaskDescriptionInput: React.FC<GhostInputProps> = ({ 
  value, 
  onPersist, 
  isTitle, 
  debounceMs = 1000,
  ...props 
}) => {
  const [localValue, setLocalValue] = useState(value);

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
    debouncedPersist(newValue);
  };

  return (
    <StyledTaskDescriptionInput
      isTitle={isTitle}
      value={localValue}
      onChange={handleChange}
      variant="outlined"
      multiline
      fullWidth
      {...props}
    />
  );
};
