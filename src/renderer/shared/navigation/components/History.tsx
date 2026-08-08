import { Link as RouterLink } from 'react-router-dom';
import { Link } from "@mui/material";
import { ParentheticalContainer } from "../../brackets";
import { useNavigation } from "../hooks";
import { StyledNavigationHistoryBreadcrumbs, StyledSeparator } from "./History.style";
import { BreadcrumbNavigationHistoryItem } from '../types';
import { NavigationLoadingHistoryIcon } from './LoadingHistory';

const HistoryItem = (
  { icon: Icon, label, path }: BreadcrumbNavigationHistoryItem
) => <ParentheticalContainer key={path} style={{ padding: '0.5rem' }}>
    <div style={{ display: 'flex', gap: '0.5rem', margin: '0.25rem' }}>
      <Icon />
      <Link
        component={RouterLink}
        color="textPrimary"
        to={path}
        underline="none"
      >{label}</Link>
    </div>
  </ParentheticalContainer>;

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
