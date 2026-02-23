import { createElement, useMemo } from "react";
import { JOB_SEARCH_INTERACTION_TYPES, JobSearchInteractionType } from "../../../../shared/features/job-search";
import { DropdownProps } from "../../../shared/common/components/Dropdown";
import { jobSearchInteractionSourceStore } from "../stores";
import { QuestionMark } from "@mui/icons-material";
import { TextFieldProps } from "@mui/material";

const options = JOB_SEARCH_INTERACTION_TYPES.map(({ label, name: value }) => ({ label, value }));

export const useJobSearchInteractionSource = (): {
  sourceType: DropdownProps;
  sourceTypeValue: JobSearchInteractionType;
  sourceValue: TextFieldProps;
} => {
  const onSelect = jobSearchInteractionSourceStore(state => state.setType);
  const setSourceValue = jobSearchInteractionSourceStore(state => state.setValue);
  const sourceType = jobSearchInteractionSourceStore(state => state.type);
  const value = jobSearchInteractionSourceStore(state => state.value);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceValue(e.target.value);
  };
  const { icon, multiline } = useMemo(() => {
    const SourceIcon = JOB_SEARCH_INTERACTION_TYPES.find(({ name }) => name === sourceType)?.icon || QuestionMark;
    const icon = createElement(SourceIcon);
    const multiline = sourceType === 'other';
    return { icon, multiline };
  }, [sourceType]);

  return {
    sourceType: {
      icon,
      onSelect,
      options,
    },
    sourceTypeValue: sourceType,
    sourceValue: {
      multiline,
      onChange,
      value,
    },
  };
};
