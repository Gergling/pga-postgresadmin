import { ListItemIcon, Typography } from '@mui/material';
import { Dropdown, DropdownOption } from '../../common/components/Dropdown';
import { BreadcrumbActiveNavigationItemChild } from '../types';
import { ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type BreadcrumbDropdownProps = {
  icon: ReactNode;
  options: BreadcrumbActiveNavigationItemChild[];
};

export const BreadcrumbDropdown = ({
  icon,
  options,
}: BreadcrumbDropdownProps) => {
  const dropdownOptions: DropdownOption[] = useMemo(() => options.map(({
    icon: Icon,
    label,
    path: value,
  }) => ({
    value,
    label: <>
      <ListItemIcon><Icon /></ListItemIcon>
      <Typography variant="body2">{label}</Typography>
    </>,
  })), [options]);
  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    navigate(value);
  };

  return (
    <Dropdown
      options={dropdownOptions}
      onSelect={handleSelect}
      icon={icon} 
    />
  );
};
