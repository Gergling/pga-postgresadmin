import { QuestionMark } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { createElement, useMemo } from "react";
import { JOB_SEARCH_INTERACTION_TYPES } from "@shared/features/job-search";
import { JobSearchUpdateForm } from "../types";
import {
  Dropdown,
  DropdownOption
} from "@/renderer/shared/common/components/Dropdown";

type Source = JobSearchUpdateForm['interaction']['source'];

type JobSearchInteractionSourceProps = {
  setValue: (value: Source) => void;
  state: {
    value: Source;
  };
};

const options = JOB_SEARCH_INTERACTION_TYPES.map(
  ({ icon, label, name }): DropdownOption<Source['type']> => {
  return {
    label: <>{icon} {label}</>,
    value: name,
  };
});

export const JobSearchInteractionSource = ({
  setValue,
  state: { value: { type, value } },
}: JobSearchInteractionSourceProps) => {
  const { icon, multiline } = useMemo(() => {
    const SourceIcon = JOB_SEARCH_INTERACTION_TYPES.find(
      ({ name }) => name === type
    )?.icon || QuestionMark;
    const icon = createElement(SourceIcon);
    const multiline = type === 'other';
    return { icon, multiline };
  }, [type]);

  const handleSelectType = (updateType: Source['type']) => {
    setValue({ type: updateType, value });
  };
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ type, value: e.target.value });
  };

  return <>
    <Dropdown
      icon={icon}
      onSelect={handleSelectType}
      options={options}
      selected={type}
    />
    <TextField
      multiline={multiline}
      onChange={handleValueChange}
      value={value}
    />
  </>;
};
