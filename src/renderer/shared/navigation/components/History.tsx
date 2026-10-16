import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Stack } from "@mui/material";
import { ParentheticalContainer } from "../../brackets";
import { COLORS, Typography } from '../../theme';
import { useNavigation } from "../hooks";
import { BreadcrumbNavigationHistoryItem } from '../types';
import {
  StyledNavigationHistoryBreadcrumbs,
  StyledSeparator
} from "./History.style";
import { NavigationLoadingHistoryIcon } from './LoadingHistory';

const HistoryItem = (
  { icon: Icon, label, path }: BreadcrumbNavigationHistoryItem
) => {
  const shortPath = useMemo(
    () => {
      if (path.length < 20) return path;

      const chunks = path.split('/');
      if (chunks.length > 3) return [
        chunks[0], chunks[1], '...', chunks[chunks.length - 1]
      ].join('/');

      return path.slice(0, 17) + '...';
    },
    [path]
  );
  return <ParentheticalContainer
    key={path}
    roundness={48}
    size={24}
    style={{ padding: '0.5rem' }}
  >
    <div style={{
      display: 'flex',
      gap: '0.25rem',
      margin: '0.25rem 0.5rem 0.25rem 0.1rem',
    }}>
      <Icon />
      <Link
        component={RouterLink}
        to={path}
        underline="none"
      >
        <Stack gap={0}>
          <Typography color={COLORS.goldGlow} variant={'overline'}>
            {shortPath}
          </Typography>
          <Typography color={COLORS.white} variant={'inherit'}>
            {label}
          </Typography>
        </Stack>
      </Link>
    </div>
  </ParentheticalContainer>;
};

export const NavigationHistory = () => {
  const { recent } = useNavigation();

  return <StyledNavigationHistoryBreadcrumbs separator={<StyledSeparator />} aria-label="history item">
    {recent.map((item) => {
      if (item.status === 'request') return <HistoryItem
        {...item} icon={NavigationLoadingHistoryIcon}
      />
      return <HistoryItem {...item} />;
    })}
  </StyledNavigationHistoryBreadcrumbs>;
};
