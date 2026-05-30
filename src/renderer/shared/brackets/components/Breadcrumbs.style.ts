import styled from '@emotion/styled';
import { COLORS, neonFilterDropShadow } from "@/renderer/shared/theme";
import { Breadcrumbs } from "@mui/material";

export const StyledParentheticalBreadcrumbSeparator = styled.div({
  width: '1rem', borderStyle: 'solid', borderWidth: '2px', borderColor: COLORS.bloodGlow, margin: 0,
  filter: neonFilterDropShadow(),
});

export const StyledParentheticalBreadcrumbs = styled(Breadcrumbs)({
  '& .MuiBreadcrumbs-ol': {
    justifyContent: 'center',
    '& > li.MuiBreadcrumbs-separator': {
      margin: 0,
    },
  },
});
