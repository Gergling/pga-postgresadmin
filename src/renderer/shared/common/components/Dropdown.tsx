import { ReactNode, useMemo, useState } from 'react';
import { Menu, MenuItem, IconButton, Button, ExtendButtonBase, IconButtonTypeMap, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type OnClickFnc = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
export type DropdownSelectorOption<T extends string | number = string | number> = {
  label: ReactNode;
  onClick?: OnClickFnc;
  value: T;
}
export type DropdownActionOption<T extends string | number = string | number> = {
  label: ReactNode;
  onClick: OnClickFnc;
  value?: T;
}
export type DropdownOption<
  T extends string | number = string | number
> = DropdownSelectorOption<T>;

type DropdownIconProps = {
  iconButtonProps?: Omit<IconButtonProps, 'children'>;
  icon: React.ReactNode;
} | {
  iconButtonProps?: never;
  icon?: never;
};

export type DropdownProps<
  T extends string | number = string | number
> = DropdownIconProps & ({
  onSelect: (value: T) => void;
  options: DropdownSelectorOption<T>[];
  selected: T;
  showSelectedText?: boolean;
} | {
  onSelect?: (value: T | undefined) => void;
  options: DropdownActionOption<T>[];
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

  const handleSelectFactory = <U extends DropdownProps<T>['options'][number],>(
    option: U
  ) => (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (option.onClick) option.onClick(e);
    if (onSelect) onSelect(option.value as T);
    setSelected(option.value);
    handleClose();
  };

  const selectedOption = useMemo(() => options.find(({ value }) => value === selected), [options, selected]);

  return (
    <>
      {showSelectedText || !icon ?
        <Button
          aria-controls={open ? 'dropdown-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={icon}
        >{selectedOption?.label}</Button>
        :
        <IconButton
          {...props.iconButtonProps}
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
        {options.map((option) => (
          <StyledMenuItem
            key={option.value}
            onClick={handleSelectFactory(option)}
          >
            {option.label}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </>
  );
};
