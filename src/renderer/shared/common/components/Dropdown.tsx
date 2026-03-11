import { ReactNode, useMemo, useState } from 'react';
import { Menu, MenuItem, IconButton, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export type DropdownOption<T extends string | number = string | number> = {
  value: T;
  label: ReactNode;
}

export type DropdownProps<T extends string | number = string | number> = {
  icon: React.ReactNode;
  onSelect: (value: T) => void;
  options: DropdownOption<T>[];
} & ({
  selected: T;
  showSelectedText?: boolean;
} | {
  selected?: never;
  showSelectedText?: false;
});

export const StyledMenu = styled(Menu)`
  padding: 0;

  & .MuiMenu-list {
    padding: 0;
  }
`;

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  paddingLeft: '6px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const Dropdown = <T extends string | number = string | number>({
  icon, onSelect, options, showSelectedText, ...props
}: DropdownProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(props.selected);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleSelect = (value: T) => {
    onSelect(value);
    setSelected(value);
    handleClose();
  };

  const selectedOption = useMemo(() => options.find(({ value }) => value === selected), [options, selected]);

  return (
    <>
      {showSelectedText ?
        <Button
          aria-controls={open ? 'dropdown-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={icon}
        >{selectedOption?.label}</Button>
      :
        <IconButton
          onClick={handleClick}
          aria-controls={open ? 'dropdown-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >{icon}</IconButton>
      }
      <StyledMenu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {options.map(({ label, value }) => (
          <StyledMenuItem
            key={value}
            onClick={() => handleSelect(value)}
          >
            {label}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </>
  );
};
