import { useEffect, useMemo, useReducer, useState } from "react";
import { FormControl, FormControlLabel, Grid, IconButton, Input, InputAdornment, InputLabel, Switch } from "@mui/material";
import { JobSearchDbSchema } from "../../../../shared/features/job-search";
import { StyledTextField, TextField } from "../../../shared/form";
import { create } from "zustand";
import { Check, Edit } from "@mui/icons-material";

// Salary range: Can be one of "No salary data known", a single number if both are equal, a range, "up to [number]", or "[number]+".

type Salary = JobSearchDbSchema['base']['applications']['salary'];
type SalaryString = { [K in keyof Salary]?: string; };

type State = SalaryString & {
  isProvided: boolean;
  isRange: boolean;
  isValidRange: boolean;
  salary?: string;
};

const salaryToString = (
  { max, min }: Salary
): SalaryString => ({ max: max?.toString(), min: min?.toString() });
const salaryFromString = (
  { max, min }: SalaryString
): Salary => ({
  max: max ? Number(max) : undefined,
  min: min ? Number(min) : undefined,
});

const updateState = (state: State) => {
  const isProvided = state.min !== undefined || state.max !== undefined;

  // Handle if the salary is a range.
  if (state.isRange) {
    const { max, min } = salaryFromString(state);
    const isValidRange = min === undefined || max === undefined || min < max;
    return {
      ...state,
      isProvided,
      isValidRange,
      salary: undefined,
    };
  }

  // Handle if the salary is not a range.
  return {
    ...state,
    isProvided,
    isValidRange: true, // Automatically valid because it's not a range.
    max: state.min,
    salary: state.min,
  };
}

const store = create<State & {
  initialise: (salary: SalaryString) => void;
  setMinimum: (min: string) => void;
  setMaximum: (max: string) => void;
  setIsRange: (isRange: boolean) => void;
}>((set) => ({
  isProvided: false,
  isRange: true,
  isValidRange: true,
  initialise: ({ max, min }) => set(state => updateState({
    ...state, max, min, isRange: max !== min
  })),
  setMinimum: (min) => set(state => updateState({ ...state, min })),
  setMaximum: (max) => set(state => updateState({ ...state, max })),
  setIsRange: (isRange) => set(state => {
    if (state.isRange === isRange) return state;
    if (isRange) return updateState({ ...state, isRange, max: undefined });
    return updateState({ ...state, isRange });
  }),
}));

const SalaryDisplay = ({
  isProvided,
  max,
  min,
  salary,
}: Omit<State, 'isRange' | 'isValidRange'>) => {
  // Loudly flag when no salary information is provided.
  if (!isProvided) return <>No salary information provided.</>;

  // A single salary figure will display a single figure.
  if (salary) return <>£{salary}</>;

  // If we have both the minimum and maximum values, we have a range.
  if (min && max) return <>£{min} - £{max}</>;

  if (min) return <>£{min}+</>;

  if (max) return <>up to £{max}</>;

  // This shouldn't happen, but here's a runtime display JIC it does.
  return <>Error: Salary is flagged as provided, but no salary data is present.</>;
};

type JobSearchUpdateSalaryProps = {
  initialEditMode?: boolean;
  setValue: (value: Salary) => void;
  value: Salary;
};

export const JobSearchUpdateSalary = ({
  initialEditMode,
  setValue,
  value,
}: JobSearchUpdateSalaryProps) => {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const {
    initialise,
    setMinimum,
    setMaximum,
    setIsRange,
    ...state
  } = store();
  const { isProvided, isRange, isValidRange, max, min, salary } = state;

  const handleMinimumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinimum(e.target.value);
  };
  const handleMaximumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaximum(e.target.value);
  };
  const handleIsRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRange(e.target.checked);
  };

  const handleSubmit = () => {
    if (!isValidRange) return;
    setValue(salaryFromString(state));
    setIsEditMode(false);
  };

  useEffect(() => {
    initialise(salaryToString(value));
  }, [initialise, value]);

  if (!isEditMode) return <>
    <SalaryDisplay
      isProvided={isProvided}
      max={max}
      min={min}
      salary={salary}
    />
    <IconButton onClick={() => setIsEditMode(true)} size="small"><Edit /></IconButton>
  </>;

  return <Grid container>
    <Grid size={4}>
      <StyledTextField
        helperText={isValidRange ? '' : 'Minimum must be smaller than maximum'}
        label={isRange ? 'Minimum' : null}
        onChange={handleMinimumChange}
        slotProps={{ input: { startAdornment: <InputAdornment position="start">£</InputAdornment> } }}
        value={min}
      />
    </Grid>
    <Grid size={3}>
      <FormControlLabel
        control={<Switch onChange={handleIsRangeChange} value={isRange} />}
        label="Range"
      />
    </Grid>
    <Grid size={4}>
      {isRange &&
        <StyledTextField
          helperText={isValidRange ? '' : 'Maximum must be greater than minimum'}
          label="Maximum"
          onChange={handleMaximumChange}
          slotProps={{ input: { startAdornment: <InputAdornment position="start">£</InputAdornment> } }}
          value={max}
        />
      }
    </Grid>
    <Grid size={1}>
      <IconButton disabled={!isValidRange} onClick={handleSubmit} size="small"><Check /></IconButton>
    </Grid>
  </Grid>;
};
