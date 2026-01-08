import { ReactNode, useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface DropdownOption {
  value: string | number;
  label: ReactNode;
}

type DropdownProps = {
  icon: React.ReactNode;
  onSelect: (value: string | number) => void;
  options: DropdownOption[];
}

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

export const Dropdown: React.FC<DropdownProps> = ({
  icon,
  onSelect,
  options,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleSelect = (value: string | number) => {
    onSelect(value);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? 'dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {icon}
      </IconButton>
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
