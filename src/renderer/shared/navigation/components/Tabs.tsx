import { Tabs, Tab, TabProps } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useMemo } from 'react';

const isSelectedTabFactory = (
  pathname: string
) => (
  { path }: { path: string; }
) => pathname.includes(path);

const StyledTabs = styled(Tabs)`
  border-bottom: 1px solid rgba(255, 0, 51, 0.3);
  & .MuiTabs-indicator {
    background-color: #ff0033; /* Neon Blood filament */
    height: 3px;
    box-shadow: 0 0 10px #ff0033, 0 0 20px #ff0033;
  }
`;

type LinkTabProps = Omit<TabProps, 'icon'> & {
  label?: React.ReactNode;
  icon: React.ComponentType;
  path: string;
}

function LinkTab({ icon: Icon, path, ...props }: LinkTabProps) {
  const { pathname } = useLocation();

  const isSelected = useMemo(() => isSelectedTabFactory(pathname)({ path }), [pathname, path]);

  return (
    <Tab
      icon={<Icon />}
      component={Link}
      aria-current={isSelected && 'page'}
      selected={isSelected}
      to={path}
      value={path}
      sx={{
        textTransform: 'uppercase',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        color: 'rgba(255, 255, 255, 0.6)',
        transition: 'all 0.2s ease-in-out',
        minHeight: '48px',

        '&.Mui-selected': {
          color: '#ffcc00', /* Alchemist Gold for the Active Sigil */
          textShadow: '0 0 8px rgba(255, 204, 0, 0.6)',
        },

        '&:hover': {
          color: '#fff',
          background: 'rgba(255, 0, 51, 0.05)',
        }

      }}
      {...props}
    />
  );
}

// Generic Wrapper to handle URL logic
export const NavigationTabs = ({ tabs }: { tabs: LinkTabProps[] }) => {
  const { pathname } = useLocation();
  const activeTabValue = useMemo(() => tabs.findIndex(isSelectedTabFactory(pathname)) || false, [pathname, tabs]);

  return (
    <StyledTabs value={activeTabValue} centered>
      {tabs.map((t) => <LinkTab key={t.path} {...t} />)}
    </StyledTabs>
  );
};
