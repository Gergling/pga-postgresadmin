import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const HistoryChips = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`;

export const NavigationBarContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  // width: 360;
  text-transform: uppercase;

  & > nav > ol > li {
    &.MuiBreadcrumbs-li {
      font-family: 'JetBrains Mono', monospace;
      // color: ${({ theme }) => theme.colors.secondary.main};
      &:hover {
        // text-shadow: 0 0 10px #ffcc00, 0 0 20px ${({ theme }) => theme.colors.primary.main};
      }
      & > * {
        color: #ffcc00;
        &:hover {
          text-shadow: 0 0 10px #ffcc00, 0 0 20px #d40000;
        }
      }
    }
    &.MuiBreadcrumbs-separator {
      color: ${({ theme }) => theme.colors.primary.main};
    }
  }
`;
