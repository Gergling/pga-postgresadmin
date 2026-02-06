import { Link as RouterLink } from 'react-router-dom';
import { Link } from "@mui/material";
import { ParentheticalContainer } from "../../brackets";
import { useNavigation } from "../hooks";
import { StyledNavigationHistoryBreadcrumbs, StyledSeparator } from "./History.style";

export const NavigationHistory = () => {
  const { recent } = useNavigation();

  return <StyledNavigationHistoryBreadcrumbs separator={<StyledSeparator />} aria-label="history item">
    {recent.map(({ icon: Icon, label, path }) => {
      return <ParentheticalContainer key={path} style={{ padding: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', margin: '0.25rem'}}>
          <Icon />
          <Link
            component={RouterLink}
            color="textPrimary"
            to={path}
            underline="none"
          >{label}</Link>
        </div>
      </ParentheticalContainer>;
    })}
  </StyledNavigationHistoryBreadcrumbs>;
};
