import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { BreadcrumbDropdown } from './BreadcrumbDropdown';
import { useNavigation } from '../../../shared/navigation/hooks';
import { PropsWithChildren } from 'react';
import { IconButton } from '@mui/material';
import { BreadcrumbActiveNavigationItem } from '../types';

const CurrentBreadcrumb = ({ children }: PropsWithChildren) => <IconButton
  component='div'
  size='small'
  sx={{
    display: 'flex',
    gap: '0.5rem',
  }}
>{children}</IconButton>;

const BreadcrumbItem = ({
  children, current, icon: Icon, label, path
}: BreadcrumbActiveNavigationItem) => {
  if (current) return <CurrentBreadcrumb>
    <Icon /> <span>{label}</span>
  </CurrentBreadcrumb>;

  return <BreadcrumbDropdown
    icon={<Icon />}
    key={path}
    options={children}
  />;
};

export function NavigationBreadcrumbs() {
  const {
    breadcrumbs,
  } = useNavigation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 360 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {breadcrumbs.map((props) => <BreadcrumbItem {...props} />)}
      </Breadcrumbs>
    </Box>
  );
}
