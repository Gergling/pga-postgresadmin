import styled from "@emotion/styled";
import { Breadcrumbs } from "@mui/material";
import { COLORS } from "../../theme/colors";
import { neonFilterDropShadow } from "../../theme/dynamic";

export const StyledSeparator = styled.div({
  width: '1rem', borderStyle: 'solid', borderWidth: '2px', borderColor: COLORS.bloodGlow, margin: 0,
  filter: neonFilterDropShadow(),
});

export const StyledNavigationHistoryBreadcrumbs = styled(Breadcrumbs)({
  '& .MuiBreadcrumbs-ol': {
    justifyContent: 'center',
    '& > li.MuiBreadcrumbs-separator': {
      margin: 0,
    },
  },
});
