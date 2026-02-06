import { Breadcrumbs, IconButton } from '@mui/material';
import { BreadcrumbDropdown } from './BreadcrumbDropdown';
import { useNavigation } from '../hooks';
import { PropsWithChildren } from 'react';
import { BreadcrumbActiveNavigationItem } from '../types';
import { NavigationBarContainer } from './Breadcrumbs.style';
import { NavigationHistory } from './History';

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
    <NavigationBarContainer>
      <Breadcrumbs separator={'//'} aria-label="breadcrumb">
        {breadcrumbs.map((props) => <BreadcrumbItem {...props} />)}
      </Breadcrumbs>
      <NavigationHistory />
    </NavigationBarContainer>
  );
}
