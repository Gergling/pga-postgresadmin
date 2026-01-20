import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Box, Breadcrumbs, Chip, IconButton, Link } from '@mui/material';
import { BreadcrumbDropdown } from './BreadcrumbDropdown';
import { useNavigation } from '../hooks';
import { PropsWithChildren } from 'react';
import { BreadcrumbActiveNavigationItem } from '../types';
import { Link as RouterLink } from 'react-router-dom';
import { HistoryChips } from './Breadcrumbs.style';

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
    recent,
  } = useNavigation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 360 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {breadcrumbs.map((props) => <BreadcrumbItem {...props} />)}
      </Breadcrumbs>
      <HistoryChips>
        {recent.map(({ icon: Icon, label, path }) => <Chip
          key={path}
          icon={<Icon />}
          label={<Link
            component={RouterLink}
            color="textPrimary"
            to={path}
            underline="none"
          >{label}</Link>}
        />)}
      </HistoryChips>
    </Box>
  );
}
