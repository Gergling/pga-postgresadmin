import { Tabs, Tab, TabProps } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useMemo } from 'react';
import { COLORS } from '../../theme/colors';

const isSelectedTabFactory = (
  pathname: string
) => (
  { path }: { path: string; }
) => path === '' ? false : pathname.includes(path);

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
  selected: boolean;
  value: number;
}

function LinkTab({ icon: Icon, path, selected, value, ...props }: LinkTabProps) {
  const { pathname } = useLocation();

  const isSelected = useMemo(() => pathname.includes(path), [pathname, path]);
  const color = useMemo(() => selected ? '#ffcc00' : COLORS.bloodGlow, [isSelected]);

  return (
    <Tab
      icon={<Icon />}
      component={Link}
      aria-current={isSelected && 'page'}
      selected={selected}
      to={path}
      value={value}
      sx={{
        textTransform: 'uppercase',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        color,
        textShadow: `0 0 8px ${color}`,
        transition: 'all 0.2s ease-in-out',
        minHeight: '48px',

        '&.Mui-selected': {
          // color: secondary, /* Alchemist Gold for the Active Sigil */
          color: '#ccbb66', /* Alchemist Gold for the Active Sigil */
          // textShadow: '0 0 8px rgba(255, 204, 0, 0.6)',
          textShadow: '0 0 20px #ffcc00',
        },

        '&:hover': {
          color: '#00d0ff',
          textShadow: '0 0 30px #00d0ff',
          // background: 'rgba(255, 0, 51, 0.05)',
        }

      }}
      {...props}
    />
  );
}

// Generic Wrapper to handle URL logic
// It's currently quite jobsearch-centric. Might wanna fix that.
export const NavigationTabs = ({ tabs }: { tabs: LinkTabProps[] }) => {
  const { pathname } = useLocation();
  const activeTabValue = useMemo(() => {
    const idx = tabs.findIndex(isSelectedTabFactory(pathname));
    return idx === -1 ? 0 : idx;
  }, [pathname, tabs]);

  return (
    <StyledTabs value={activeTabValue} centered>
      {tabs.map((t, i) => <LinkTab key={i} {...t} selected={i === activeTabValue} />)}
    </StyledTabs>
  );
};
